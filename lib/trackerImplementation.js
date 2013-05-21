var fs = require("fs"),
    mongo = require("mongodb"),
    BSON = mongo.BSONPure,
    MongoClient = mongo.MongoClient,
    GridStore = mongo.GridStore,
    url = require('url');

var sys = require('sys');

/**
 * Used to manage localization from localizable server data blocks. Currently
 * a stub as I18N is not a high priority task. This will eventually peek in the
 * request headers, probably not using an off-the-shelf module like locale as
 * there is no finite set of locales expected. 
 */
function localize(localizableData) {
  return localizableData ? localizableData["default"] : "<<missing label>>";
}


/**
 * An asynchronous callbacky system for handling annotations on 
 * things. We don't actually worry too much about what we are annotating
 * and we ought to be able to handle a whole bunch of different functions 
 * this way. 
 * 
 * @param entity
 * @param queries - a list of objects, each containing {collection, query, fields, callback}
 * @param callback - called when we are out of queries
 */
function annotateEntity(db, object, queries, callback) {
  if (queries.length == 0) {
    return callback(object)
  } else {
    var queryRecord = queries.shift();
    var collection = queryRecord.collection;
    var handler = queryRecord.callback;
    
    db.collection(collection, function(err, collection) {
      if (queryRecord.query !== undefined) {
        var fields = queryRecord.fields || {};
        var cursorFunction = queryRecord.cursor || function(cursor, cx) { return cursor.toArray(cx); };
        cursorFunction(collection.find(queryRecord.query, fields), function(err, results) {
          return handler(object, results, function() {
            annotateEntity(db, object, queries, callback);
          });
        });
      } else if (queryRecord.aggregation !== undefined) {
        collection.aggregate(queryRecord.aggregation, function(err, results) {
          return handler(object, results, function() {
            annotateEntity(db, object, queries, callback);
          });
        });
      } else {
        callback({error: "can't process query record"});
      }
    });
  }
}

module.exports.annotateEntity = annotateEntity;

function urlSetter(doc) {
  return function (entity) {
    entity.url = doc.url + "/" + entity.role + "/" + entity.identity;
  }
}

function getCountsQuery(studySelector) {
  return {
    collection : "entities",
    aggregation: [
      {"$match" : studySelector},
      {"$project" : { "role" : 1}},
      {"$group" : {"_id" : "$role", "count" : {"$sum" : 1}}}
    ],
    callback : function(object, results, next) {
      var counts = {};
      results.forEach(function(e) {
        counts[e["_id"]] = e["count"];
      });
      object["counts"] = counts;
      return next();
    }
  };
}

function getStepsQuery(studySelector) {
  return {
    collection : "steps",
    aggregation: [
      {"$match" : studySelector},
      {"$sort" : { "weight" : 1}}
    ],
    callback : function(object, results, next) {
      var stepData = {};
      results.forEach(function(e) {
        if (stepData[e["appliesTo"]] === undefined) {
          stepData[e["appliesTo"]] = [];
        }
        e["label"] = localize(e["label"]);
        stepData[e["appliesTo"]].push(e);
      });
      object["steps"] = stepData;
      return next();
    }
  }
}

function placeholderDefault(name, defaultValue) {
  return function(req) {
    return req.query[name] || defaultValue;
  }
}

function placeholderObjectId(name) {
  return function(req) {
    return new BSON.ObjectID(req.query[name].toString());
  }
}

function completePlaceholders(req, pipeline) {
  switch (typeof pipeline) {
  case "object":
    if (Array.isArray(pipeline)) {
      return pipeline.map(function(e) {
        return completePlaceholders(req, e);
      });
    } else {
      var result = new Object;
      Object.keys(pipeline).forEach(function(key) {
        result[key] = completePlaceholders(req, pipeline[key]);
      });
      return result;
    }
  case "function":
    return pipeline(req);
  default:
    return pipeline;
  }
}

var queries = {
  "getEntities" : {
    "collection" : "entities",
    "pipeline" : [
      { "$match" : { "studyId" : placeholderObjectId("studyId"), "role" : placeholderDefault("role", "participants") } },
      { "$sort" : { "lastModified" : -1 } },
      { "$skip" : placeholderDefault("offset", 0) },
      { "$limit" : 10 }
    ],
    "updater" : function(study, results) {
      results.forEach(function(element) {
        element.url = study.url + "/" + element.role + "/" + element.identity;
      })
    }
  }
};

/**
 * Helper function to asynchronously find a study. 
 * @param db
 * @param req
 * @param callback
 */

function findStudy(db, req, callback) {
  var name = req.params.study;
  db.collection("studies", function(err, studies) {
    var selector = (name.substr(0, 3) === "id;") ? {"_id": new BSON.ObjectID(name.substring(3))} : {name: name};
    studies.find(selector).limit(1).toArray(function(err, docs) {
      if (err) {
        return callback(err, null);
      }
      var doc = docs[0];
      var studyId = new BSON.ObjectID(doc._id.toString());
      doc.url = "/studies/" + doc.name;
      return callback(null, doc);
    });
  });
}

module.exports.findStudy = findStudy

/**
 * Helper function to asynchronously find a study. 
 * @param db
 * @param req
 * @param callback
 */

function findEntity(db, studyId, role, identity, callback) {
  db.collection("entities", function(err, entities) {
    
    var selector = {"studyId": studyId, "role" : role};
    if (identity.substr(0, 3) === "id;") {
      var key = identity.substr(3);
      if (key == "new") {
        return callback("no such object: " + identity, null);
      }
      selector["_id"] = new BSON.ObjectID(identity.substr(3));
    } else {
      selector["identity"] = identity;
    }

    entities.find(selector).limit(1).toArray(function(err, docs) {
      if (err) {
        return callback(err, null);
      }
      var doc = docs[0];
      return callback(null, doc);
    });
  });
}

module.exports.findEntity = findEntity;

/**
 * Database endpoint to read a single study. This should also read a set of the 
 * related entities of all types. 
 * @param name - the name of the study
 * @param callback - function accepting (err, doc, db)
 */
function getStudy(err, db, req, res, callback) {
  findStudy(db, req, function(err, doc) {
    var studyId = new BSON.ObjectID(doc._id.toString());
    var studySelector = {"studyId": studyId};
    var fields = {"_id": 1, "role": 1, "identity" : 1, "lastModified" : 1, "steps.fields.$": 1};
    
    // We will also want a bunch of useful queries to be run to complete
    // the study. We can use the recursive callback model to do that, so we
    // handle the JS asynchronicity as well as we can do. These could in 
    // theory be done as subrequests, but to do things like counting
    // the number of participants and generating a summary of recent
    // activity is moot whether we ought to do that. 
    
    if (req["query"] !== undefined && req["query"].hasOwnProperty('q')) {
      
      var query = req["query"];
      var queryName = query["q"];
      
      var queryRecord = queries[queryName];
      if (queryRecord === undefined) {
        return callback(db, "Can't find query: " + name, {"error" : "Can't find query: " + name}, res);
      }
      var collectionName = queryRecord["collection"] || "entities";
      var pipeline = queryRecord["pipeline"];
      
      query["studyId"] = studyId;
      var modified = completePlaceholders(req, pipeline);
      
      db.collection(collectionName, function(err, collection) {
        collection.aggregate(modified, function(err, results) {
          if (queryRecord["updater"] !== undefined) {
            queryRecord["updater"](doc, results);
          }
          var result = new Object;
          result["data"] = results;
          callback(db, err, result, res);
        });
      });

    } else {
      var countsQuery = getCountsQuery(studySelector);
      var stepsQuery = getStepsQuery(studySelector);
      
      annotateEntity(db, doc, [countsQuery, stepsQuery], function(o) {
        return callback(db, err, {data: o}, res);
      });
    }
  });    
}
    
module.exports.getStudy = getStudy;

/**
 * Returns a list of step identifiers for the steps in this entity.
 * @param entity
 * @returns
 */
function getEntityStepIds(entity) {
  var steps = {};
  entity.steps.forEach(function(step) {
    steps[step.stepRef] = step.stepRef;
  });
  return Object.keys(steps);
}

function buildRelatedEntities(entity, related) {
  var data = {};
  var studyUrl = entity.study.url;
  var relatedLength = related.length;
  for(var i = 0 ; i < relatedLength; i++) {
    var e = related[i];
    if (e.identity !== undefined) {
      e.url = studyUrl + "/" + e.role + "/" + e.identity;
    } else {
      e.url = studyUrl + "/" + e.role + "/" + "id;" + e._id.toString();
    }
    if (data[e.role] == undefined) {
      data[e.role] = [];
    }
    data[e.role].push(e);
  }
  entity.related = data;
}

/**
 * A teeny tiny eval we can use to get properties fast without caching
 * or compiling anything. Good for template usage. 
 * @param object
 * @param value
 * @returns
 */
function miniEval(object, value) {
  var start = 0, end = value.length;
  var originalValue = value;
  while(start != end) {
    var next = value.indexOf(".", start);
    var element = value.slice(start, (next == -1) ? end : next);
    if (object.hasOwnProperty(element)) {
      object = object[element];
    } else {
      throw new EvalError("Missing property: " + originalValue);
    }
    if (next == -1) {
      return object; 
    } else {
      start = next + 1;
    }
  }
}

function getEntityFields(entity) {
  var fields = {};
  entity.steps.forEach(function(step) {
    //console.log("Step", step);
    step.fields.forEach(function(field) {
      // console.log("Field", field);
      fields[field["key"]] = field;
    });
  });

  return fields;
}

module.exports.getEntityFields = getEntityFields;

/**
 * buildEntityValues
 * @param entity
 * @param stepsArray
 */
function buildEntityValues(entity, stepsArray) {
  var fields = {};
  
  stepsArray.forEach(function(step) {
    for(var field in step.fields) {
      fields[field] = step.fields[field];
    }
  });
  
  // Now merge the keys from the entity itself
  entity.steps.forEach(function(step) {
    step.fields.forEach(function(field) {
      var fieldName = field.key;
      for (var property in field) { 
        if (fields[fieldName] === undefined) {
          fields[fieldName] = {};
        }
        fields[fieldName][property] = field[property];
      }
    });
  });
  
  for(var field in fields) {
    var record = fields[field];
    var type = record.type;
    
    if (record.hasOwnProperty("value") && record.value != null) {
      if (type == "Date") {
        record.displayValue = record.value.toString();
      } else {
        record.displayValue = record.value.toString();
      }
    } else if (record.hasOwnProperty("identity")) {
      record.displayValue = record.identity;
    }
  }
  
  entity.values = fields;

  var availableSteps = stepsArray.map(function(step) {
    var stepDefinition = {};
    stepDefinition.name = step.name;
    stepDefinition.label = (step.editLabel) ? localize(step.editLabel) : localize(step.label);
    if (step.url) {
      var fieldExpression = /\{\{([^}]+)\}\}/g;
      var fieldReplacer = function(match, m1) {
        return miniEval(entity, m1);
      };
      stepDefinition.url = step.url.replace(fieldExpression, fieldReplacer);
    } else {
      stepDefinition.url = entity.url + "/step/" + step.name;
    }
    return stepDefinition;
  });
  
  entity.availableSteps = availableSteps;
}

// There are two sets of related entities: those which have a "steps.fields.ref"
// that link back to me, and those which we have a link to from one of ours 
// steps with a reference field. We should actually ask for both. We can do
// this with a top-level $or in MongoDB, as this actually runs the queries
// in parallel. 
                
function buildRelatedEntitySelector(entity) {
  var relatedSelector = { "steps.fields.ref" : new BSON.ObjectID(entity._id.toString()) };
  var relatedList = [];
  entity.steps.forEach(function(step) {
    step.fields.forEach(function(field) {
      var ref = field['ref'];
      if (ref !== undefined) {
        relatedList.push(ref)
      }
    });
  });
  if (relatedList.length > 0) {
    return { "$or" : [ { "_id" : { "$in" : relatedList } }, relatedSelector ] }
  } else {
    return relatedSelector;
  }
}

function maybeInterceptedCallback(plugin, db, err, result, res, callback) {
  if (plugin) {
    var module = plugin["module"];
    var method = plugin["method"];
    var loadedModule = require("./plugins/" + module);
    var method = loadedModule[method];
    method(db, err, result, res, callback);
  } else{
    callback(db, err, result, res);
  }
}

/**
 * Database endpoint to read a single entity. 
 * @param studyName
 * @param role
 * @param identity
 * @param callback
 */
function getEntity(err, db, req, res, callback) {
  var role = req.params.role;
  var identity = req.params.identity;
 
  findStudy(db, req, function(err, doc) {
    if (err) { return callback(db, {err: err}, null, res); }
    var studyId = new BSON.ObjectID(doc._id.toString());


    findEntity(db, studyId, role, identity, function(err, entity) {
      if (err) { return callback(db, {err: err}, null, res); }
      if (entity === undefined) { return callback(db, {err: "Missing entity: " + role + ", " + identity}, null, res); }
      entity.study = doc;
      entity.notes = doc.notes[role] || {};
      entity.url = doc.url + "/" + role + "/" + identity;
      
      // Find all the available steps
      var stepSelector = {"studyId" : studyId, "appliesTo" : role};
      //var stepSelector = {"_id" : {"$in" : getEntityStepIds(entity).map(function(id) { return new BSON.ObjectID(id); }) }};
      
      // Now locate the requested entity
      db.collection("steps", function(err, steps) {
        steps.find(stepSelector).toArray(function(err, allStepsArray) {
          
          var stepsArray = allStepsArray.sort(function(a, b) {
            var aWeight = a.weight === undefined ? 1000 : a.weight;
            var bWeight = b.weight === undefined ? 1000 : b.weight;
            var diff = aWeight - bWeight;
            return diff ? diff < 0 ? -1 : 1 : 0;
          });
          
          // And finally, related entities. 
          var relatedSelector = buildRelatedEntitySelector(entity);
          db.collection("entities", function(err, entities) {
            entities.find(relatedSelector).toArray(function(err, related) {

              var result = {data: entity};

              try {
                buildRelatedEntities(entity, related);
  
                // Add in the step-based field definitions
                buildEntityValues(entity, stepsArray);

              } catch (exception) {
                if (exception instanceof Error) {
                  err = {err: exception.message};
                  result = null;
                }
              } finally {
                var plugin = entity.notes.readEntity;
                return maybeInterceptedCallback(plugin, db, err, result, res, callback);
              }
            });
          });
        });
      });
    });
  });
}

module.exports.getEntity = getEntity;

function compareViews(a, b) {
  var aWeight = a.weight === undefined ? 1000000 : a.weight;
  var bWeight = b.weight === undefined ? 1000000 : b.weight;
  var result = (aWeight < bWeight) ? -1 : (aWeight > bWeight) ? 1 : 0;
  return result;
}

/**
 * Database endpoint to read a single study. This should also read a set of the 
 * related entities of all types. 
 * @param name - the name of the study
 * @param callback - function accepting (err, doc, db)
 */
function getViews(err, db, req, res, callback) {
  var name = req.params.study;
  var role = req.params.role;
  
  findStudy(db, req, function(err, doc) {
    var selector = {"studyId": new BSON.ObjectID(doc._id.toString()), "role" : role};
    
    // Now collect the views
    db.collection("views", function(err, views) {
      var cursor = views.find(selector);
      cursor.toArray(function(err, results) {
        results.sort(compareViews);
        callback(db, err, {data: results}, res);
      });
    });
  });
}
    
module.exports.getViews = getViews;

function findEntityStepWithEntity(db, req, res, studyId, entity, callback) {
  var role = req.params.role;
  var stepName = req.params.step;
  var query = req.query || {};
  
  // Find all the referenced step identifiers
  var stepSelector = {"studyId" : studyId, "appliesTo" : role, "name" : stepName };
  // Now locate the requested entity
  //console.error("getEntityStepWithEntity", stepSelector, entity);
  db.collection("steps", function(err, steps) {
    steps.find(stepSelector).toArray(function(err, stepsArray) {
      var step = stepsArray[0];
      if (! step) {
        return callback(db, err, {data: step}, res);
      }
      
      step.label = localize(step.label);
      
      // This is weird logic, and I wish I'd commented it when I wrote it. The 
      // steps contain all fields. This builds a set of all field values in 
      // stepValues, but doesn't do defaulting or anything. 
      var stepValues = {};
      var stepDescriptors = entity.steps || [];
      var stepDescriptorCount = stepDescriptors.length;
      for(var i = 0; i < stepDescriptorCount; i++) {
        var thisStep = stepDescriptors[i];
        if (thisStep.stepRef.equals(step._id)) {
          thisStep.fields.forEach(function(field) {
            stepValues[field.key] = field.value !== undefined ? field.value : field.identity;
          });
          break;
        }
      }
      
      // Now we handle the fields for the selected step. 
      var fields = step.fields || {};
      Object.keys(fields).forEach(function(fieldKey) {
        step.fields[fieldKey].label = localize(step.fields[fieldKey].label);
        if (query[fieldKey] !== undefined) {
          step.fields[fieldKey].value = query[fieldKey];
        } else if (stepValues[fieldKey] === undefined && step.fields[fieldKey].hasOwnProperty("default")) {
          step.fields[fieldKey].value = step.fields[fieldKey].default;
        } else if (stepValues[fieldKey] !== undefined) {
          step.fields[fieldKey].value = stepValues[fieldKey];
        }
      });
      
      entity.step = step;
      callback(db, err, {data: entity}, res, 200);
    });
  });
}

function getEntityStep(err, db, req, res, callback) {
  var studyName = req.params.study;
  var role = req.params.role;
  var identity = req.params.identity;
  
  findStudy(db, req, function(err, doc) {
    var studyId = new BSON.ObjectID(doc._id.toString());
    var entityModifier = function(entity) {
      entity.study = doc;
      entity.url = doc.url + "/" + role + "/" + identity;
      return entity;
    };
    
    if (identity === "id;new") {
      var entity = {};
      return findEntityStepWithEntity(db, req, res, studyId, entityModifier(entity), callback);
    }
    
    findEntity(db, studyId, role, identity, function(err, entity) {
      return findEntityStepWithEntity(db, req, res, studyId, entityModifier(entity), callback);
    });
  });
}

module.exports.getEntityStep = getEntityStep;

// Under some circumstances, we want a quick way to list the identities and 
// references for a set of entities with a given role in a study. This is
// primarily used for dropdowns and the like. We don't need full field 
// expansion or management to do this, a brief two-step (study then entities)
// query should suffice. 

function getEntities(err, db, req, res, callback) {
  var studyName = req.params.study;
  var role = req.params.role;
  var filter = req.query ? req.query["q"] : "^"

  findStudy(db, req, function(err, doc) {
    var selector = {"studyId": new BSON.ObjectID(doc._id.toString()), "role" : role};
    if (filter != "^") {
      selector["identity"] = { "$regex" : filter, "$options" : "i" };
    }
    
    // Now locate the requested entity
    db.collection("entities", function(err, entities) {
      var cursor = entities.find(selector);
      cursor.toArray(function(err, results) {

        callback(db, err, {data: results}, res);
      });
    });
  });
}

module.exports.getEntities = getEntities;

// Handling the entity step updates is a little more interesting, but not all that much.
// An upsert will do most of the work (we're in a POST context, after all) and then we 
// need to build up all the right data for loading into something interesting for 
// returning. We can/should probably do some dumbass validation while we are at it. And
// that really should include an element optimistic locking so that nobody can crap out
// the data while we're not watching. 

function StepError(message, data) {
  this.name = "StepError";
  this.message = (message || "");
  this.data = data;
}
StepError.prototype = new Error();
StepError.prototype.constructor = StepError;

// Core update building, written to be asynchronous, and therefore
// interestingly recursive. The callback gets an updater and an error
// and can handle it accordingly. That allows it to do database lookup
// and other slow stuff, rather than having to do everything. This can also do validation,
// and it probably should. 

function findStepUpdater(db, studyId, step, fields, errors, updater, callback) {    
  
  var remainingFields = (fields === undefined) ? [] : Object.keys(fields);
  
  // Simple case: no more fields, we are done.
  if (remainingFields.length == 0) {
    
    // Check for missing fields. These will be absent but required.
    var foundFields = {};
    var missingFields = [];
    updater["$set"]["steps.$.fields"].forEach(function(field) {
      foundFields[field.key] = 1;
    });
    if (step.fields !== undefined) {
      Object.keys(step.fields).forEach(function(stepField) {
        if (step.fields[stepField].required && ! foundFields[stepField]) {
          missingFields.push(stepField);
        }
      })
    }
    
    // If there are missing fields, add to the error
    if (missingFields.length > 0) {
      errors["missingFields"] = missingFields;
      errors.err = "missing fields: " + missingFields.join(", ");
    }
    
    // If the error is empty, make it null
    if (Object.keys(errors).length == 0) {
      errors = null;
    }
    return callback(db, errors, updater);
  }
  
  // Grab and remove the first property.
  var fieldName = remainingFields.shift();
  var fieldValue = fields[fieldName];
  delete fields[fieldName];
  
  // Discard if it's not a step field
  if (! step.fields.hasOwnProperty(fieldName)) {
    return findStepUpdater(db, studyId, step, fields, errors, updater, callback);
  }
  
  // Otherwise, get the field definition.
  var fieldDefinition = step.fields[fieldName];
  
  // Use the field type, but carefully. 
  var newField = {"key" : fieldName};
  
  if (fieldDefinition.identity) {
    newField["identity"] = fieldValue.value;
    updater["$set"]["steps.$.fields"].push(newField);
    updater["$set"]["identity"] = newField["identity"];
    return findStepUpdater(db, studyId, step, fields, errors, updater, callback);
    
  } else if (fieldDefinition.type == 'Reference' && fieldDefinition.hasOwnProperty('entity')) {
    // This is where we need to do a lookup. Obviously, this is essentially
    // just validation, and we ought to be validating the other fields too. But that can wait. 
    
    var reference = fieldValue.value;
    var role = fieldDefinition.entity;
    db.collection("entities", function(err, entities) {
      entities.find({_id: reference}).limit(1).toArray(function(err, docs) {
        if (err) {
          return callback(db, {err: err}, null);
        } else if (docs.length == 0) {
          errors.missingObject = ["role", reference.toString()];
          return findStepUpdater(db, studyId, step, fields, errors, updater, callback);
        } else {
          var entity = docs[0];
          var id = new BSON.ObjectID(entity._id.toString());
          newField["ref"] = id;
          updater["$set"]["steps.$.fields"].push(newField);
          return findStepUpdater(db, studyId, step, fields, errors, updater, callback);
        }
      });
    })
    return;
        
  } else if (! fieldDefinition.identity) {
    newField["value"] = fieldValue.value;
    updater["$set"]["steps.$.fields"].push(newField);
    
    // If it's a name field, set the name too. 
    if (fieldDefinition.name) {
      updater["$set"]["name"] = newField["value"];
    };
    
    return findStepUpdater(db, studyId, step, fields, errors, updater, callback);
  }
  
  throw new Error("Should never get here!");
}

module.exports.findStepUpdater = findStepUpdater;

function connected(callback) {
  return function(req, res) {
    MongoClient.connect("mongodb://localhost:27017/tracker", function (err, db) {
      callback(err, db, req, res);
    });
  }
}

module.exports.connected = connected;

// Now we can handle some of the additional logic in handling a POST
// request. We have to handle entities as we do with a GET request. The 
// special cases involve the handling of the stepOptions field. That tells
// us what to do. If the method is set to CreateEntity, we should make a new
// entity, i.e. do an upsert. Some values in some fields can be set (actually
// this needs to happen for a GET request, too, at least for display reasons)
// and then we can build a new entity and create the wee beauty. 

function postEntityStep(err, db, req, res, callback) {
  var studyName = req.params.study;
  var role = req.params.role;
  var identity = req.params.identity;
  var stepName = req.params.step;

  findStudy(db, req, function(err, doc) {
    var studyId = new BSON.ObjectID(doc._id.toString());

    // Find the referenced step 
    var stepSelector = {"studyId" : studyId, "appliesTo" : role, "name" : stepName };
    db.collection("steps", function(err, steps) {
      steps.find(stepSelector).toArray(function(err, stepsArray) {
        var step = stepsArray[0];
        
        var existingEntityStepSelector = {
          "studyId" : studyId, 
          "role" : role, 
          "steps.stepRef" : new BSON.ObjectID(step._id.toString())
        };
        existingEntityStepSelector["identity"] = identity;

        // The important bit: build the step updater. This can generate an error. If it 
        // does we should go no further but pass it to the callback here and now. 
        
        var initialUpdater = {"$set" : {}};
        initialUpdater["$set"]["steps.$.fields"] = [];
        initialUpdater["$set"]["steps.$.stepDate"] = new Date();
        initialUpdater["$set"]["lastModified"] = new Date();
        findStepUpdater(db, studyId, step, req.body.data.step.fields, {}, initialUpdater, function(db, err, updater) {
          
          if (err) {
            return callback(db, err, err.toString(), res, 400);
          }
          
          var newIdentity = (updater["$set"]["identity"] || identity);
          var newUrl = doc.url + "/" + role + "/" + newIdentity + '/step/' + stepName;
          
          var updateOptions = {"fsync" : true, "w" : 1};
          
          db.collection("entities", function(err, entities) {
            entities.update(existingEntityStepSelector, updater, updateOptions, function (err, result) {
              
              if (err) {
                return callback(db, err, newUrl, res);
              }
              
              // Now if result == 1 we changed something. If result == 0, we didn't, and
              // need to actually do something about it. That could mean that the step didn't exist, 
              // or that the entity didn't exist. We can handle entities that didn't exist
              // later, as really should 404. 
              
              if (result == 0) {
                
                if (existingEntityStepSelector["identity"] == "id;new") {
                  existingEntityStepSelector["identity"] = updater["$set"]["identity"];
                  existingEntityStepSelector["steps"] = [];
                  updateOptions["upsert"] = true;
                }
                // When we don't have an identity, make one that's going to be unique. 
                if (existingEntityStepSelector["identity"] === undefined) {
                  existingEntityStepSelector["identity"] = new BSON.ObjectID().toString();
                }
                if (updater["$push"] === undefined) {
                  updater["$push"] = {};
                }
                updater["$push"]["steps"] = {
                  "stepRef" : existingEntityStepSelector['steps.stepRef'],
                  "id" : new BSON.ObjectID(),
                  "fields" : updater["$set"]["steps.$.fields"],
                  "stepDate" : updater["$set"]["steps.$.stepDate"]
                };
                delete updater["$set"]["steps.$.fields"];
                delete updater["$set"]["steps.$.stepDate"];
                delete existingEntityStepSelector['steps.stepRef'];
                
                entities.update(existingEntityStepSelector, updater, updateOptions, function (err, result) {
                  
                  // First let's handle errors, which are always a possibility
                  if (err) {
                    return callback(db, err, newUrl, res);
                  }
                  
                  if (result == 0) {
                    
                    // If we get here, we've failed again. This means that we don't have an entity that we can
                    // use. That means we have a wee problem. We should never get here, really, but we might. 
                    
                    return callback(db, "Internal error inserting document", newUrl, res)
                    
                  } else {
                    return callback(db, err, newUrl, res);
                  }
                  
                });
              } else {
                return callback(db, err, newUrl, res);
              };
            });
          });
        });
      });
    });
  });
}

module.exports.postEntityStep = postEntityStep;

/*
 * An entity step can also have attached files. These are handled using a different request,
 * and they will typically arrive out of band. This means that the entity will typically
 * require some deferred processing to actually make the data work. We will get the
 * data in a temporary file, and really we should log and/or store this somewhere better,
 * so if things get killed by the system, we can pick up the pieces. Because these files
 * could potentially be large, we use Mongo's GridFS for this. At the end, when we have the
 * data, we can add a reference into the step. Only then are we good to close out the 
 * request with success. 
 */

/**
 * Takes a list of files and a callback, writes the files into GridFS in the
 * given database, and when done, calls the callback with an error flag and
 * a list of identifiers we can use to reference these files. 
 */
function storeEntityFiles(db, data, files, identifiers, callback) {
  
  //console.log("Called storeEntityFiles", sys.inspect(data, null, 2), sys.inspect(files, null, 2));
  
  // If we are done, let's be happy
  if (files.length === 0) {
    return callback(null, identifiers);
  }
  
  // Otherwise, handle the first file then recurse
  // Make up a random filename, mainly so we can get at the data through mongofiles
  var identifier = new BSON.ObjectID();
  var filename = identifier.toHexString() + ".dat";
  var file = files.shift();
  identifiers.push(identifier);
  var done = function() {
    //console.log("Recursing");
    return storeEntityFiles(db, data, files, identifiers, callback);
  };
  
  var metadata = {
    "name" : file.name,
    "size" : file.size,
    "lastModifiedDate" : file.lastModifiedDate,
    "storeDate" : new Date()
  };
  for (var key in data) { 
    metadata[key] = data[key]; 
  }

  //console.log("Writing file", identifier, file, metadata);

  var gridStore = new GridStore(db, identifier, filename, "w", { "content_type" : file.type, "metadata" : metadata });
  gridStore.writeFile(file.path, function(err, doc) {
    //console.log("About to close", err);
    gridStore.close(function() {
      //console.log("Done writing file", identifier);
      return done();      
    });
  });
}

/**
 * Handles the final step hooks. These are called when a step has been completed.
 * Most of them don't need to do anything, as all the handling and so on has already
 * been integrated. In a few cases, however, notably with file uploads, we really
 * want to analyze a file and add some additional data, either to the step or to
 * related components. 
 */

/**
 * Handler for an entity's step's files. These will be written into GridFS, and we
 * can find them there. We should also attach them to the entity, the step, and so
 * on, but we can do that through the GridFS metadata initially, and then use
 * a background process to handle the data. 
 * 
 * @param req
 * @param callback
 */

/*
 * In an ideal world, on completion of the file upload, there would be a speedy
 * local update to the step. That is in an ideal world. The question is: how do we
 * handle data like this. We have some advantages: at least we don't have to worry too
 * much about a file system, and we can bounce it off to a second process.
 */
function postEntityStepFiles(err, db, req, res, callback) {
  
  var studyName = req.params.study;
  var role = req.params.role;
  var identity = req.params.identity;
  var stepName = req.params.step;

  if (err) {
    return callback(db, err, req.url, res, 500);
  }

  findStudy(db, req, function(err, doc) {
    var studyId = new BSON.ObjectID(doc._id.toString());
    var data = {
      "studyId" : studyId,
      "role" : role,
      "identity" : identity,
      "step" : stepName
    };
    
    db.collection("steps", function(err, steps) {
      
      // Look for the step. We might have a plugin attached to it, and if
      // so, we need to do something. This is nly invoked when we are handling
      // files, and this might be a mistake on the long term. Might be better for the
      // plugins to run after the step itself is submitted, picking up the file
      // identifiers at that stage. 
      
      var stepSelector = {"studyId" : studyId, "appliesTo" : role, "name" : stepName};
      steps.find(stepSelector).limit(1).toArray(function(err, stepsArray) {
        var step = stepsArray[0];
        
        function finalize(err, storeResponse) {
          //console.log("Called finalize");
          if (step.hasOwnProperty('plugin')) {
            var module = step.plugin.module;
            var method = step.plugin.method;
            var loadedModule = require("./plugins/" + module);
            var method = loadedModule[method];
            method(db, storeResponse, res, function(err, data) {
              return callback(db, null, {data: data}, res, 200);
            });
          } else {
            return callback(db, null, {data: storeResponse}, res, 200);
          }
        }
        
        var onEnd = function() {
          //console.log("Storing files", req.files);
          storeEntityFiles(db, data, req.files.files, [], function(err, identifiers) {
            // A fake error, it has status 200
            var storeResponse = data;
            data["files"] = identifiers;
            finalize(err, storeResponse);
          });
        }
        
        //console.log(req);
        req.form.on('error', function(error) {
          console.log("Some error encountered", sys.inspect(error, null, 2));
        });
 
        req.form.on('aborted', function() {
          console.log("Request cancelled");
        })

        req.form.on('end', onEnd);
  
        req.form.on('progress', function(bytesReceived, bytesExpected) {
          console.log("Progress", ((bytesReceived / bytesExpected)*100) + "% uploaded");
        });
        
        if (req.form.ended && Object.keys(req.files).length > 0) {
          onEnd();
        }
      });
    });
  });
}

module.exports.postEntityStepFiles = postEntityStepFiles;

function init() {
  MongoClient.connect("mongodb://localhost:27017/tracker", function(err, db) {
    var indexes = [
    ];
    function addIndexes() {
      if (indexes.length == 0) {
        return;
      } else {
        var index = indexes.shift();
        return db.createIndex(index["collection"], index["index"], addIndexes);
      }
    };
    addIndexes();
  });
}
  
module.exports.initialize = init;
