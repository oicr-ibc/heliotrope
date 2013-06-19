var fs = require("fs"),
    mongo = require("mongodb"),
    BSON = mongo.BSONPure,
    MongoClient = mongo.MongoClient,
    GridStore = mongo.GridStore,
    url = require('url');

var sys = require('sys'),
    assert = require('assert');

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
 * Given a set of objects, it returns an array of all the actual access
 * objects present within them, omitting those that don't exist.
 */
function accessList() {
  var i, length = arguments.length;
  var accessList = [];
  for(i = 0; i < length; i++) {
    var access = arguments[i];
    if (access["access"]) {
      accessList.push(access["access"]);
    }
  }
  return accessList;
}

/**
 * Checks the current request against admin permissions, usually attached to
 * a study or something similar. 
 * 
 * @param req - the request, containing the user
 * @param mode - a string, "modify" for read/write access, and "read" for read access
 */
function checkAdminAccess(req, mode) {
  if (! req.user) return false;
  if (req.user.roles && req.user.roles.indexOf('ADMIN') !== -1) return true;
  return false;
}

module.exports.checkAdminAccess = checkAdminAccess;

/**
 * Checks a user identifier request against an access structure, usually attached to
 * a study or something similar. 
 * 
 * @param req - the request, containing the user
 * @param access - object with read and modify properties, possibly
 * @param mode - a string, "modify" for read/write access, and "read" for read access
 */

function checkAccessList(req, access, mode) {

  var user = req.user;
  if (! user) return false;

  var userId = user.userId;

  // For an array, we work through until we get an access we like. 
  var i, length = access.length;

  for(i = 0; i < length; i++) {
    var accessRecord = access[i];
    var modifyAllowed = accessRecord.modify && accessRecord.modify.indexOf(userId) !== -1;
    if (modifyAllowed) return true;
    var readAllowed = accessRecord.read && accessRecord.read.indexOf(userId) !== -1;
    if (readAllowed) {
      if (mode !== 'modify') 
        return true
      else
        return false
    }
    if (accessRecord.none && accessRecord.none.indexOf(userId) !== -1) 
      return false;
  }

  return false;
}

module.exports.checkAccessList = checkAccessList;

/**
 * Helper function to asynchronously find a study. 
 * 
 * @param db - the MongoDB connection
 * @param req - the request
 * @param res - the response
 * @param callback - a callback, taking an error status and the resulting study. 
 */

function findStudy(db, req, res, mode, callback) {
  var name = req.params.study;
  db.collection("studies", function(err, studies) {

    var selector = (name.substr(0, 3) === "id;") ? {"_id": new BSON.ObjectID(name.substring(3))} : {name: name};

    studies.find(selector).limit(1).toArray(function(err, docs) {

      if (err) return callback(err, null);
      if (docs.length == 0) return callback({error: "Not Found"}, null);

      // If we get a study back, but the requested user is not allowed access to it, then we 
      // can simply refuse access. The callback needs to be subtle enough to distingish between
      // a status of 404 (not found) and 403 (forbidden). We do this by setting a local value for 
      // a status when it's forbidden. Note that an authorization error is not a 401 -- that's
      // only for HTTP authorization and we are beyond that. For more information on that issue:
      // http://stackoverflow.com/questions/3297048/403-forbidden-vs-401-unauthorized-http-responses
      // 
      // As an exception, obviously, administrative users (e.g., me) can always get access. And that's
      // a user role.

      var doc = docs[0];
      var studyId = new BSON.ObjectID(doc._id.toString());
      doc.url = "/studies/" + doc.name;

      if (checkAdminAccess(req, mode) || checkAccessList(req, accessList(doc), mode)) {
        return callback(null, doc);
      } else {
        res.locals.statusCode = 403;
        return callback({error: "Forbidden"}, null);
      }

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
 * Database endpoint to read all the study information. For each study, we also ought to
 * provide some kind of a data block that can be useful for rendering. That will typically 
 * involve aggregating entity information for that study. 
 *
 * @param err - error flag
 * @param db - database connection
 * @param req - web request 
 * @param res - web response 
 * @param callback - function accepting (db, err, result, res, [status])
 */
function getStudies(err, db, req, res, callback) {
  db.collection("studies", function(err, studies) {
    studies.find({}).toArray(function(err, docs) {

      if (err) { return callback(db, {err: err}, null, res); }

      // First, build a table of the study records. For each one, make a URL while we are
      // at it. 
      var results = {}
      docs.forEach(function(doc) {
        doc.url = "/studies/" + doc.name;
        doc.statistics = {};
        doc.lastModified = "";
        results[doc._id.toString()] = doc;
      });

      // Now let's do a call on the entities, using aggregation to derive a more complete
      // data count for each one.

      var statistics = [
        {"$project" : {"studyId" : 1, "role" : 1, "lastModified" : 1}},
        {"$group": {"_id": {"studyId": "$studyId", "role": "$role"}, "count": {"$sum" : 1}, "lastModified": {"$max" : "$lastModified"}}}
      ]

      db.collection("entities", function(err, entities) {
        entities.aggregate(statistics, function(err, stats) {

          stats.forEach(function(stat) {
            var studyId = stat["_id"]["studyId"].toString();
            var role = stat["_id"]["role"];
            delete stat["_id"];
            results[studyId]["statistics"][role] = stat;
            if (! results[studyId]["lastModified"]) {
              results[studyId]["lastModified"] = stat["lastModified"];
            } else if (stat["lastModified"] > results[studyId]["lastModified"]) {
              results[studyId]["lastModified"] = stat["lastModified"];
            }
          });

          var result = new Object;
          result["data"] = Object.keys(results).map(function(key) { return results[key]; });
          callback(db, err, result, res, 200);
        });
      });
    });
  });
}

module.exports.getStudies = getStudies;

// db.entities.aggregate(
//   {"$project" : {"studyId" : 1, "role" : 1, "lastModified" : 1}},
//   {"$group": { _id: {"studyId": "$studyId", "role": "$role"}, count: {"$sum" : 1 }, lastModified: {"$max" : "$lastModified"} } }
// );

/**
 * Database endpoint to read a single study. This should also read a set of the 
 * related entities of all types. 
 * @param name - the name of the study
 * @param callback - function accepting (err, doc, db)
 */
function getStudy(err, db, req, res, callback) {
  findStudy(db, req, res, 'read', function(err, doc) {

    // If we have an error, respond appropriately.
    if (err) return callback(db, err, doc, res, res.locals.statusCode || 404);
    if (! doc) return callback(db, err, doc, res, res.locals.statusCode || 404);

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
          callback(db, err, result, res, 200);
        });
      });

    } else {
      var countsQuery = getCountsQuery(studySelector);
      var stepsQuery = getStepsQuery(studySelector);
      
      annotateEntity(db, doc, [countsQuery, stepsQuery], function(o) {
        return callback(db, err, {data: o}, res, 200);
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
 * Updates the field display values. fields is an object keyed
 * by field name, and related is an array of related objects. We 
 * expect the core settings for a value to be available. 
 */

function buildFieldsDisplayValues(fields, related) {
  for(var field in fields) {
    var record = fields[field];
    var type = record.type;
    
    if (record.hasOwnProperty("ref") && record.ref != null) {
      var relCount = related.length;
      for(var i = 0; i < relCount; i++) {
        var rel = related[i];
        if (rel._id.equals(record.ref)) {
          record.displayValue = rel.identity;
        }
      }
    } else if (record.hasOwnProperty("value") && record.value != null) {
      if (type == "Date") {
        record.displayValue = record.value.toString();
      } else {
        record.displayValue = record.value.toString();
      }
    } else if (record.hasOwnProperty("identity")) {
      record.displayValue = record.identity;
    }
  }
}

/**
 * buildEntityStepUrls adds URLs to all the steps in an entity. 
 * It really helps if we have a set of steps we can use with definitions
 * to make sure we get the right URL.
 * @param entity
 */

function buildEntityStepUrls(entity, stepsArray) {
  var stepTable = {};

  stepsArray.forEach(function(step) {
    stepTable[step._id.toString()] = step;
  });

  // At this late stage, we can filter out steps we don't want. 

  entity.steps = entity.steps.filter(function(step) {
    var stepDefinition = stepTable[step.stepRef.toString()];
    var url = entity.url;
    if (stepDefinition) {
      step.url = url + "/step/" + stepDefinition.name;
      if (stepDefinition.isRepeatable) {
        step.url = step.url + ";" + step.id.toString();
      }
      return true;
    } else {
      return false;
    }
  });
}

/**
 * buildEntityValues
 * @param entity
 * @param stepsArray
 */
function buildEntityValues(entity, related, stepsArray) {
  var fields = {};
  
  stepsArray.forEach(function(step) {
    for(var field in step.fields) {
      fields[field] = step.fields[field];
    }
  });
  
  // Now merge the keys from the entity itself. 
  entity.steps.forEach(function(step) {
    step.fields.forEach(function(field) {
      var fieldName = field.key;
      for (var property in field) { 
        if (fields[fieldName] === undefined) {
          continue;
          fields[fieldName] = {};
        } else {

        }
        fields[fieldName][property] = field[property];
      }
    });
  });


  buildFieldsDisplayValues(fields, related);
  
  entity.values = fields;

  var availableSteps = stepsArray.map(function(step) {
    var stepDefinition = {};
    stepDefinition._id = step._id;
    stepDefinition.name = step.name;
    stepDefinition.label = (step.redoLabel) ? localize(step.redoLabel) : localize(step.label);
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
                
function buildRelatedEntitySelector(entity, step, query) {
  if (! entity._id) {
    var alternates = [];
    Object.keys(step.fields).forEach(function(fieldKey) {
      var field = step.fields[fieldKey];
      if (field.type === "Reference" && query[fieldKey]) {
        alternates.push({"identity" : query[fieldKey], "role" : field.entity});
      }
    });
    if (alternates.length) {
      return { "$or" : alternates };
    } else {
      return { "_id" : null }
    }
  }
  var relatedList = [];
  var relatedSelector = { "steps.fields.ref" : new BSON.ObjectID(entity._id.toString()) };
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

function maybeInterceptedCallback(plugin, db, err, result, req, res, callback) {
  if (plugin) {
    var module = plugin["module"];
    var method = plugin["method"];
    var loadedModule = require("./plugins/" + module);
    var method = loadedModule[method];
    method(db, err, result, req, res, callback);
  } else{
    callback(db, err, result, res, 200);
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
  var userId = req.user.userId;
 
  findStudy(db, req, res, 'read', function(err, doc) {

    // If we have an error, respond appropriately.
    if (err) return callback(db, err, doc, res, res.locals.statusCode || 404);
    if (! doc) return callback(db, err, doc, res, res.locals.statusCode || 404);

    var studyId = new BSON.ObjectID(doc._id.toString());

    findEntity(db, studyId, role, identity, function(err, entity) {
      if (err) { return callback(db, {err: err}, null, res); }
      if (entity === undefined) { return callback(db, {err: "Missing entity: " + role + ", " + identity}, null, res); }
      entity.study = doc;
      entity.notes = (doc.nodes && doc.notes[role]) || {};
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

          // Build a filtered set of steps, based on access rules
          stepsArray = stepsArray.filter(function(step) {
            return checkAccessList(req, accessList(step, doc), 'read');
          });

          // And finally, related entities. 
          var relatedSelector = buildRelatedEntitySelector(entity);
          db.collection("entities", function(err, entities) {
            entities.find(relatedSelector).toArray(function(err, related) {

              var result = {data: entity};

              try {
                buildRelatedEntities(entity, related);

                // Add in the step-based field definitions
                buildEntityValues(entity, related, stepsArray);

                buildEntityStepUrls(entity, stepsArray);

              } catch (exception) {
                if (exception instanceof Error) {
                  err = {err: exception.message};
                  result = null;
                }
              } finally {
                var plugin = entity.notes.readEntity;
                return maybeInterceptedCallback(plugin, db, err, result, req, res, callback);
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
  
  findStudy(db, req, res, 'read', function(err, doc) {

    // If we have an error, respond appropriately.
    if (err) return callback(db, err, doc, res, res.locals.statusCode || 404);
    if (! doc) return callback(db, err, doc, res, res.locals.statusCode || 404);

    var selector = {"studyId": new BSON.ObjectID(doc._id.toString())};
    if (role)
      selector["role"] = role;
    
    // Now collect the views
    db.collection("views", function(err, views) {
      var cursor = views.find(selector);
      cursor.toArray(function(err, results) {
        results.sort(compareViews);

        // If we're not using a role, structure the response accordingly. 
        if (role) 
          return callback(db, err, {data: {study: doc, views: results}}, res, 200);

        var result = {};
        results.forEach(function(view) {
          if (! result[view["role"]]) 
            result[view["role"]] = [];
          result[view["role"]].push(view);
        });

        return callback(db, err, {data: {study: doc, views: result}}, res, 200);
      });
    });
  });
}
    
module.exports.getViews = getViews;

/**
 * Database endpoint to read a single study. This should also read a set of the 
 * related entities of all types. 
 * @param name - the name of the study
 * @param callback - function accepting (err, doc, db)
 */
function getView(err, db, req, res, callback) {
  var name = req.params.study;
  var role = req.params.role;
  var view = req.params.view;
  
  findStudy(db, req, res, 'read', function(err, doc) {

    // If we have an error, respond appropriately.
    if (err) return callback(db, err, doc, res, res.locals.statusCode || 404);
    if (! doc) return callback(db, err, doc, res, res.locals.statusCode || 404);

    var selector = {"studyId": new BSON.ObjectID(doc._id.toString()), "role" : role, "name" : view};
    
    // Now collect the views
    db.collection("views", function(err, views) {
      var cursor = views.find(selector).limit(1).toArray(function(err, results) {
        if (err) return callback(db, err, doc, res, res.locals.statusCode || 404);
        return callback(db, err, {data: {study: doc, view: results[0]}}, res, 200);
      });
    });
  });
}
    
module.exports.getView = getView;

function getStepSelector(studyId, role, stepName) {
  
  var stepSelector = {"studyId" : studyId, "appliesTo" : role};
  var semicolonPosition = stepName.indexOf(";");
  if (semicolonPosition !== -1) {
    stepSelector["name"] = stepName.substring(0, semicolonPosition);
  } else {
    stepSelector["name"] = stepName;
  }

  return stepSelector;
}

/**
 * getSelectedDataBlock returns a matching data block from a list, using 
 * the step identity in the step name (if there is one), or otherwise the
 * identity from the step definition read from the DB. 
 */
function getSelectedDataBlock(stepName, stepDefinition, stepDataBlocks) {

  // If there is a step identifier in the name, the selected data block should be
  // identified by the identifier, rather than by the name (or, strictly, stepRef)
  // which is not unique for repeated steps. 

  var stepId;
  var semicolonPosition = stepName.indexOf(";");
  if (semicolonPosition !== -1) {
    stepId = stepName.substring(semicolonPosition + 1);
  }
  
  var selectedStepDataBlock;
  var stepDataBlockCount = stepDataBlocks.length;

  for(var i = 0; i < stepDataBlockCount; i++) {
    var thisStep = stepDataBlocks[i];

    if (stepId) {

      // We are using the step identifier to find a step
      if (thisStep.id.toString() === stepId) {
        selectedStepDataBlock = thisStep;
        break;
      }

    } else if (thisStep.stepRef.equals(stepDefinition._id)) {

      // Otherwise, we find a matching stepRef, which will have been keyed by name
      // from the database. 

      selectedStepDataBlock = thisStep;
      break;
    }

  }
 
  return selectedStepDataBlock;
}


// Woefully inadequate. This requires us to locate related entities, as usual, and we also ought to do all 
// the field defaulting code just as we do for the entity as a whole. 

function findEntityStepWithEntity(db, req, res, studyId, entity, callback) {
  var role = req.params.role;
  var stepName = req.params.step;
  var query = req.query || {};

  // If the step name contains a semicolon, the part after the semicolon will be
  // an ObjectId string we can use as a better way of locating repeated steps. 

  var stepSelector = getStepSelector(studyId, role, stepName);
  
  // Now locate the requested step.
  //console.error("getEntityStepWithEntity", stepSelector, entity);
  db.collection("steps", function(err, steps) {
    steps.find(stepSelector).toArray(function(err, stepsArray) {

      if (err) {
        return callback(db, {err: err}, res);
      } else if (stepsArray.length == 0) {
        return callback(db, {err: "Missing step: " + stepName}, res);
      }

      var step = stepsArray[0];
      var stepDefinition = stepsArray[0];
      if (! stepDefinition) {
        return callback(db, {err: "Missing step definition: " + stepName}, null, res);
      }
      
      // This is weird logic, and I wish I'd commented it when I wrote it. The 
      // steps contain all fields. This builds a set of all field values in 
      // stepValues, but doesn't do defaulting or anything. 

      var stepValues = {};
      var stepDataBlocks = entity.steps || [];
      var stepDataBlockCount = stepDataBlocks.length;

      for(var i = 0; i < stepDataBlockCount; i++) {
        var thisStep = stepDataBlocks[i];
        if (thisStep.stepRef.equals(stepDefinition._id)) {
          thisStep.fields.forEach(function(field) {
            stepValues[field.key] = field.ref !== undefined   ? field.ref 
                                  : field.value !== undefined ? field.value 
                                  : field.identity;
          });
          break;
        }
      }

      var selectedStepDataBlock = getSelectedDataBlock(stepName, stepDefinition, stepDataBlocks);

      // Change the step label to be localized.
      if (selectedStepDataBlock && stepDefinition.redoLabel !== undefined) {
        stepDefinition.label = localize(stepDefinition.redoLabel);
      } else {
        stepDefinition.label = localize(stepDefinition.label);
      }
      
      // We may, or may not, have related entities here. If we do, we need to make an effort to
      // find them, and to resolve references to display values for rendering relations to
      // other entities. Note that some related entities may be defined even if we don't actually
      // have a primary entity yet, because we are about to create one. Therefore, the step
      // descriptor and the query are also required. 

      // And finally, related entities. 
      var relatedSelector = buildRelatedEntitySelector(entity, stepDefinition, query);
      db.collection("entities", function(err, entities) {
        entities.find(relatedSelector).toArray(function(err, related) {

          buildRelatedEntities(entity, related);

          // console.log("Entity", sys.inspect(entity, false, 4));

          // Now we handle the fields for the selected step. 

          var fields = stepDefinition.fields || {};
          // console.log("Step definition fields", sys.inspect(fields, false, 3));
          // console.log("Current step values", sys.inspect(stepValues, false, 3));
          // console.log("Related objects", sys.inspect(related, false, 3));

          // Iff we've done this step before, find the field and merge the keys
          if (selectedStepDataBlock) {
            Object.keys(fields).forEach(function(fieldKey) {

              stepDefinition.fields[fieldKey].label = localize(stepDefinition.fields[fieldKey].label);

              var currentValueObject;
              var fieldCount = selectedStepDataBlock.fields.length;
              for(var j = 0; j < fieldCount; j++) {
                if (selectedStepDataBlock.fields[j].key == fieldKey) {
                  currentValueObject = selectedStepDataBlock.fields[j];
                }
              }

              if (typeof currentValueObject === "object") {
                Object.keys(currentValueObject).forEach(function(valueKey) {
                  if (valueKey !== "key") {
                    // console.log("Adding field slot", fieldKey, valueKey);
                    stepDefinition.fields[fieldKey][valueKey] = currentValueObject[valueKey];
                  }
                });
              }
            });
          } else {

            // We've never done this step before, but we do have a step definition. Use it
            // to pull in query params and write values in. Especially related references,
            // which is key. 

            Object.keys(fields).forEach(function(fieldKey) {

              stepDefinition.fields[fieldKey].label = localize(stepDefinition.fields[fieldKey].label);

              var field = fields[fieldKey];
              var queryValue = query[fieldKey];
              if (queryValue) {
                if (field.isIdentity) {
                  stepDefinition.fields[fieldKey]["identity"] = queryValue
                } else if (field["type"] === "Reference") {
                  related.forEach(function(relatedEntity) {
                    if (relatedEntity.identity === queryValue) {
                      stepDefinition.fields[fieldKey]["ref"] = relatedEntity._id;
                      stepDefinition.fields[fieldKey]["value"] = relatedEntity.identity;
                    }
                  })
                } else {
                  stepDefinition.fields[fieldKey]["value"] = queryValue;
                }
              }
            });

          };

          buildFieldsDisplayValues(stepDefinition.fields, related);

          entity.step = stepDefinition;
          callback(db, err, {data: entity}, res, 200);
        });
      });
    });
  });
}

function getEntityStep(err, db, req, res, callback) {
  var studyName = req.params.study;
  var role = req.params.role;
  var identity = req.params.identity;
  
  findStudy(db, req, res, 'read', function(err, doc) {

    // If we have an error, respond appropriately.
    if (err) return callback(db, err, doc, res, res.locals.statusCode || 404);
    if (! doc) return callback(db, err, doc, res, res.locals.statusCode || 404);

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

  findStudy(db, req, res, 'read', function(err, doc) {

    // If we have an error, respond appropriately.
    if (err) return callback(db, err, doc, res, res.locals.statusCode || 404);
    if (! doc) return callback(db, err, doc, res, res.locals.statusCode || 404);

    var selector = {"studyId": new BSON.ObjectID(doc._id.toString()), "role" : role};
    if (filter != "^") {
      selector["identity"] = { "$regex" : filter, "$options" : "i" };
    }
    
    // Now locate the requested entity
    db.collection("entities", function(err, entities) {
      var cursor = entities.find(selector);
      cursor.toArray(function(err, results) {

        callback(db, err, {data: results}, res, 200);
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
        if (step.fields[stepField].isRequired && ! foundFields[stepField]) {
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
  
  if (fieldDefinition.isIdentity) {
    newField["identity"] = fieldValue["identity"];
    updater["$set"]["steps.$.fields"].push(newField);
    updater["$set"]["identity"] = newField["identity"];
    return findStepUpdater(db, studyId, step, fields, errors, updater, callback);
    
  } else if (fieldDefinition.type == 'Reference' && fieldDefinition.hasOwnProperty('entity')) {
    // This is where we need to do a lookup. Obviously, this is essentially
    // just validation, and we ought to be validating the other fields too. But that can wait. 

    var reference = fieldValue.ref;
    var role = fieldDefinition.entity;

    var selector = (fieldValue.ref !== undefined) ? {_id: new BSON.ObjectID(fieldValue.ref.toString())} 
                 : (fieldValue.value !== undefined) ? {identity: fieldValue.value} 
                 : undefined; 
    if (! selector) {
      throw new Error("Internal error finding related reference: " + sys.inspect(fieldValue, false, 3));
    }

    // console.log("Selector", selector);

    db.collection("entities", function(err, entities) {
      entities.find(selector).limit(1).toArray(function(err, docs) {
        // console.log("Found", err, docs);
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
        
  } else if (! fieldDefinition.isIdentity) {
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

/**
 * Endpoint to create a new study, or update an existing study (depending on whether
 * or not we have an identifier). The body is in approximately the right shape, so
 * we don't need to do too much except strip out some of the crap added by the getStudy
 * endpoint. 
 */

function postStudies(err, db, req, res, callback) {

  // Need to be an editor to do this. Obviously
  if (! req.user.hasRole('TRACKER_ADMIN'))
    return callback(db, {error: "Forbidden"}, {}, res, 403);

  // Get the request
  var body = req.body;

  // Validate, at least a little
  if (! body["data"]["name"])
    return callback(db, {error: "Missing study name"}, {}, res, 400);
  
  // Clean up the added fields
  ["config", "counts", "steps", "url", "serviceUrl"].forEach(function(field) {
    delete body["data"][field];
  });
  
  // Prep for Mongo. Use an update/upsert, as we aren't really supposed to use save()
  // as it's a bit non-atomic.

  var id = body["data"]["_id"] || new BSON.ObjectID().toString();
  delete body["data"]["_id"];
  delete body["data"]["version"];

  var selector = {"_id" : new BSON.ObjectID(id)};
  var updates = {"$set" : {}};
  Object.keys(body["data"]).forEach(function(fieldName) {
    updates["$set"][fieldName] = body["data"][fieldName];
  });

  updates["$inc"] = {"version" : 1};

  var newUrl = "/studies/" + encodeURIComponent(body["data"]["name"]);

  db.collection("studies", function(err, studies) {
    studies.update(selector, updates, {"upsert" : true, "w" : 1, "fsync" : 1}, function(err, result) {
      return callback(db, err, newUrl, res);
    });
  });
}

module.exports.postStudies = postStudies;

function getStudyStep(err, db, req, res, callback) {
  var studyName = req.params.study;
  var role = req.params.role;
  var name = req.params.step;

  findStudy(db, req, res, 'read', function(err, doc) {

    // If we have an error, respond appropriately.
    if (err) return callback(db, err, doc, res, res.locals.statusCode || 404);
    if (! doc) return callback(db, err, doc, res, res.locals.statusCode || 404);

    var studyId = new BSON.ObjectID(doc._id.toString());
    var stepSelector = {"studyId": studyId, "appliesTo" : role, "name" : name};

    db.collection("steps", function(err, steps) {
      steps.find(stepSelector).toArray(function(err, steps) {

        if (err) return callback(db, err, doc, res, res.locals.statusCode || 404);
        var result = {data: {study: doc, step: steps[0]}};
        return callback(db, err, result, res, 200);
      });
    });
  });
};

module.exports.getStudyStep = getStudyStep;

function getStudyView(err, db, req, res, callback) {
  var studyName = req.params.study;
  var role = req.params.role;
  var name = req.params.view;

  findStudy(db, req, res, 'read', function(err, doc) {

    // If we have an error, respond appropriately.
    if (err) return callback(db, err, doc, res, res.locals.statusCode || 404);
    if (! doc) return callback(db, err, doc, res, res.locals.statusCode || 404);

    var studyId = new BSON.ObjectID(doc._id.toString());
    var viewSelector = {"studyId": studyId, "role" : role, "name" : name};

    db.collection("views", function(err, views) {
      views.find(viewSelector).toArray(function(err, views) {

        if (err) return callback(db, err, doc, res, res.locals.statusCode || 404);
        var result = {data: {study: doc, view: views[0]}};
        return callback(db, err, result, res, 200);
      });
    });
  });
};

module.exports.getStudyView = getStudyView;

/**
 * Service endpoint implementation to create (or update) a new view definition.
 * This reads the data from the request body, but only uses a little of it when
 * creating the actual view definition. 
 */
function postStudyView(err, db, req, res, callback) {
  var studyName = req.params.study;
  var body = req.body;

  if (! body["data"]["view"]["name"])
    return callback(db, {error: "Missing view name"}, null, res, 400);
  if (! body["data"]["view"]["role"])
    return callback(db, {error: "Missing view role"}, null, res, 400);

  findStudy(db, req, res, 'modify', function(err, doc) {

    // If we have an error, respond appropriately.
    if (err) return callback(db, err, doc, res, res.locals.statusCode || 404);
    if (! doc) return callback(db, err, doc, res, res.locals.statusCode || 404);

    var studyId = new BSON.ObjectID(doc._id.toString());
    var selector = {"studyId": studyId, "role" : body["data"]["view"]["role"], "name" : body["data"]["view"]["name"]};

    db.collection("views", function(err, views) {

      // Throw away _id as we never want to use it, version because we increment it later, and hack studyId as we supply it. 
      delete body["data"]["view"]["_id"];
      delete body["data"]["view"]["version"];
      body["data"]["view"]["studyId"] = studyId;

      // Now we create the update action. So far, we haven't changed the database 
      // at all. 

      var updates = {"$set" : {}};
      Object.keys(body["data"]["view"]).forEach(function(fieldName) {
        updates["$set"][fieldName] = body["data"]["view"][fieldName];
      });

      updates["$inc"] = {"version" : 1};

      var newUrl = "/views/" + studyName + "/" + encodeURIComponent(body["data"]["view"]["role"]) + "/" + encodeURIComponent(body["data"]["view"]["name"]);

      views.update(selector, updates, {"upsert" : true, "w" : 1, "fsync" : 1}, function(err, result) {
        return callback(db, err, newUrl, res);
      });
    });
  });
};

module.exports.postStudyView = postStudyView;

/**
 * Service endpoint implementation to create (or update) a new step definition.
 * This reads the data from the request body, but only uses a little of it when
 * creating the actual step definition. 
 */
function postStudyStep(err, db, req, res, callback) {
  var studyName = req.params.study;
  var body = req.body;

  if (! body["data"]["step"]["name"])
    return callback(db, {error: "Missing step name"}, null, res, 400);
  if (! body["data"]["step"]["appliesTo"])
    return callback(db, {error: "Missing step appliesTo"}, null, res, 400);

  findStudy(db, req, res, 'modify', function(err, doc) {

    // If we have an error, respond appropriately.
    if (err) return callback(db, err, doc, res, res.locals.statusCode || 404);
    if (! doc) return callback(db, err, doc, res, res.locals.statusCode || 404);

    var studyId = new BSON.ObjectID(doc._id.toString());
    var selector = {"studyId": studyId, "appliesTo" : body["data"]["step"]["appliesTo"], "name" : body["data"]["step"]["name"]};

    db.collection("steps", function(err, steps) {

      // Throw away _id as we never want to use it, version because we increment it later, and hack studyId as we supply it. 
      delete body["data"]["step"]["_id"];
      delete body["data"]["step"]["version"];
      body["data"]["step"]["studyId"] = studyId;

      // Now we create the update action. So far, we haven't changed the database 
      // at all. 

      var updates = {"$set" : {}};
      Object.keys(body["data"]["step"]).forEach(function(fieldName) {
        updates["$set"][fieldName] = body["data"]["step"][fieldName];
      });

      updates["$inc"] = {"version" : 1};

      var newUrl = "/steps/" + studyName + "/" + encodeURIComponent(body["data"]["step"]["appliesTo"]) + "/" + encodeURIComponent(body["data"]["step"]["name"]);

      steps.update(selector, updates, {"upsert" : true, "w" : 1, "fsync" : 1}, function(err, result) {
        return callback(db, err, newUrl, res);
      });
    });
  });
};

module.exports.postStudyStep = postStudyStep;

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

  findStudy(db, req, res, 'read', function(err, doc) {

    // If we have an error, respond appropriately.
    if (err) return callback(db, err, doc, res, res.locals.statusCode || 404);
    if (! doc) return callback(db, err, doc, res, res.locals.statusCode || 404);

    var studyId = new BSON.ObjectID(doc._id.toString());
    var stepSelector = getStepSelector(studyId, role, stepName);

    // Find the referenced step 
    db.collection("steps", function(err, steps) {
      steps.find(stepSelector).toArray(function(err, stepsArray) {
        var step = stepsArray[0];

        // Actually, to work with a step, we need read access to the study, and modify access
        // to the step. This means rejection. Although we have defined read access, here we don't
        // need to test for it, nor do we in reading steps either. 

        var access = accessList(step, doc);
        if (checkAdminAccess(req, 'modify') || checkAccessList(req, access, 'modify')) {
          // All is good; continue
        } else {
          res.locals.statusCode = 403;
          return callback(db, {error: "Forbidden"}, null, res, 403);
        }

        // Handle repeating steps. When we have a repeating step with an identifier as part
        // of the step name, locate that step specifically. We can use that instead of the
        // stepRef, as it is more specific. In both cases, these locate (through $) the individual
        // specific step to update. 
        //
        // A special case should be the stepRef without an identifier for a repeating step. 
        // In this case, we should really use a newly constructed step identifier, so we 
        // guarantee not to find and modify an existing step.

        var stepId;
        var semicolonPosition = stepName.indexOf(";");
        if (semicolonPosition !== -1) {
          stepId = stepName.substring(semicolonPosition + 1);
          stepName = stepName.substring(0, semicolonPosition);
        }

        var existingEntityStepSelector = {
          "studyId" : studyId, 
          "role" : role, 
          "identity" : identity
        };
        if (step["isRepeatable"]) {
          existingEntityStepSelector["steps.id"] = (stepId) ? new BSON.ObjectID(stepId) : new BSON.ObjectID();
        } else {
          existingEntityStepSelector["steps.stepRef"] = new BSON.ObjectID(step._id.toString());
        }

        // The important bit: build the step updater. This can generate an error. If it 
        // does we should go no further but pass it to the callback here and now. 
        
        var initialUpdater = {"$set" : {}};
        initialUpdater["$set"]["steps.$.fields"] = [];
        initialUpdater["$set"]["steps.$.stepDate"] = new Date();
        initialUpdater["$set"]["steps.$.stepUser"] = req.user || null;
        initialUpdater["$set"]["lastModified"] = new Date();
        findStepUpdater(db, studyId, step, req.body.data.step.fields, {}, initialUpdater, function(db, err, updater) {
          
          if (err) {
            return callback(db, err, err.toString(), res, 400);
          }
          
          // OK. At this stage we have an updater. We can proceed to use it. Again, for a repeating step,
          // we get an identifier tagged on the end of the URL.
          var newIdentity = (updater["$set"]["identity"] || identity);
          var newUrl = doc.url + "/" + role + "/" + newIdentity + "/step/" + stepName;
          if (step["isRepeatable"]) {
            newUrl = newUrl + ";" + existingEntityStepSelector["steps.id"].toString();
          }

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

                // At this stage, we failed to locate an existing step. If the step is repeatable
                // we can move ahead with a new identifier here. 

                updater["$push"]["steps"] = {
                  "fields" : updater["$set"]["steps.$.fields"],
                  "stepDate" : updater["$set"]["steps.$.stepDate"],
                  "stepUser" : (req.user && req.user.userId) || null,
                  "stepRef" : new BSON.ObjectID(step._id.toString())
                };
                if (step["isRepeatable"]) {
                  updater["$push"]["steps"]["id"] = existingEntityStepSelector["steps.id"];
                } else {
                  updater["$push"]["steps"]["id"] = new BSON.ObjectID();
                }
                delete updater["$set"]["steps.$.fields"];
                delete updater["$set"]["steps.$.stepDate"];
                delete updater["$set"]["steps.$.stepUser"];
                delete existingEntityStepSelector['steps.stepRef'];
                delete existingEntityStepSelector['steps.id'];
                
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

  findStudy(db, req, res, 'modify', function(err, doc) {

    // If we have an error, respond appropriately.
    if (err) return callback(db, err, doc, res, res.locals.statusCode || 404);
    if (! doc) return callback(db, err, doc, res, res.locals.statusCode || 404);

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

        // Actually, to work with a step, we need read access to the study, and modify access
        // to the step. This means rejection. Although we have defined read access, here we don't
        // need to test for it, nor do we in reading steps either. 

        var access = (step.access !== undefined) ? [step.access, doc.access] : [doc.access];

        if (checkAdminAccess(req, 'modify') || checkAccessList(req, access, 'modify')) {
          // Do nothing, we're good to continue
        } else {
          res.locals.statusCode = 403;
          return callback(db, {error: "Forbidden"}, null, res, 403);          
        }
        
        function finalize(err, storeResponse) {
          //console.log("Called finalize");
          if (step.hasOwnProperty('plugin')) {
            var module = step.plugin.module;
            var method = step.plugin.method;
            var loadedModule = require("./plugins/" + module);
            var method = loadedModule[method];
            method(db, storeResponse, req, res, function(err, data) {
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

/**
 * getRelatedEntities is used with a study, role, and identity, and allows a
 * filtered set of related entities to be identified and returned. As such, it
 * is similar to getEntities(), but uses a given entity (rather than the whole
 * study) as a starting point. The identity of each is usually not the issue,
 * but field values for each related entity might well be, as might their roles.
 */

function findReferences(entity) {
  var related = [];
  if (entity.steps) {
    entity.steps.forEach(function(step) {
      if (step.fields) {
        step.fields.forEach(function(field) {
          if (field.hasOwnProperty("ref")) {
            related.push(field.ref);
          }
        });
      }
    });
  }
  return related;
}

function compareEntities(a, b) {
  var akey = a.name || a.identity.toString();
  var bkey = b.name || b.identity.toString();
  return akey.localeCompare(bkey);
}

function getRelatedEntities(err, db, req, res, callback) {
  var studyName = req.params.study;
  var role = req.params.role;
  var identity = req.params.identity;

  findStudy(db, req, res, 'read', function(err, doc) {

    // If we have an error, respond appropriately.
    if (err) return callback(db, err, doc, res, res.locals.statusCode || 404);
    if (! doc) return callback(db, err, doc, res, res.locals.statusCode || 404);

    var studyId = new BSON.ObjectID(doc._id.toString());
    var selector = {"studyId": studyId, "role" : role};

    findEntity(db, studyId, role, identity, function(err, entity) {
      if (err) { return callback(db, {err: err}, null, res); }
      if (entity === undefined) { return callback(db, {err: "Missing entity: " + role + ", " + identity}, null, res); }
    
      // Now locate the requested related entities. These must all 
      // relate to the given entity. Also, when we get each, we can
      // add them to the result. If we assume, with simplicity, that
      // the related entities should be filtered only by *string* fields
      // value types, we can compose a value request with some degree
      // of elegance. 

      var related = findReferences(entity);

      // So the final query includes all these, but it also includes those that
      // refer back.
      var dbQueries = [];
      if (related.length) {
        dbQueries.push({"_id" : {"$in": related}});
      }
      dbQueries.push({"steps.fields.ref" : entity._id});
      var selector = (dbQueries.length > 1) ? {"$or" : dbQueries} : dbQueries[0];

      // If there are any filters, we can $and them in too, on the basis
      // that we are dealing with entities. These will typically be simple
      // things like a role. To distinguish from others, we also allow 
      // underscores to be used as a prefix. This allows _role to be 
      // used as a filter. 

      var filters = req.query ? Object.keys(req.query).map(function(key) {
        var value = req.query[key];
        if (key.substring(0, 1) === "_") {
          key = key.substring(1);
        }
        var entry = {};
        entry[key] = value;
        return entry;
      }) : [];

      if (filters.length) {
        selector = {"$and" : [selector].concat(filters)};
      }

      db.collection("entities", function(err, entities) {
        var cursor = entities.find(selector).toArray(function(err, results) {
          if (err) { return callback(db, {err: err}, null, res); }
          var sorted = results.sort(compareEntities);
          return callback(db, err, {data: sorted}, res, 200);
        });
      });
    });
  });
}

module.exports.getRelatedEntities = getRelatedEntities;

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
