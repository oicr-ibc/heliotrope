var mongo = require("mongodb"),
    BSON = mongo.BSONPure,
    MongoClient = mongo.MongoClient;

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
 * Database endpoint to read a single study. This should also read a set of the 
 * related entities of all types. 
 * @param name - the name of the study
 * @param callback - function accepting (err, doc, db)
 */
function getStudy(req, callback) {
  var name = req.params.study;
  MongoClient.connect("mongodb://localhost:27017/tracker", function(err, db) {

    // First find the study
    db.collection("studies", function(err, studies) {
      studies.find({name: name}).limit(1).toArray(function(err, docs) {
        var doc = docs[0];
        doc.url = "/studies/" + name;
        var selector = {"studyId": new BSON.ObjectID(doc._id.toString()), "steps.fields.key" : "identifier"};
        var fields = {"_id": 1, "role": 1, "steps.fields.$": 1};
        
        // Locate a summary version of all entities
        db.collection("entities", function(err, entities) {
          var cursor = entities.find(selector, fields);
          cursor.toArray(function(err, results) {
            
            // Add in a URL for each entity
            results.forEach(function(entity) {
              entity.url = doc.url + "/" + entity.role + "/" + entity.steps[0].fields[0].identity;
            });
            doc.entities = results;
            
            // Send back the response
            callback(db, err, {data: doc});
          });
        });
      });
    });
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

function buildEntityValues(entity, stepsArray) {
  var fields = {};
  stepsArray.forEach(function(step) {
    for(var field in step.fields) {
      fields[field] = step.fields[field];
    }
  });
  
  var availableSteps = stepsArray.map(function(step) {
    var stepDefinition = {};
    stepDefinition.name = step.name;
    stepDefinition.label = (step.editLabel) ? localize(step.editLabel) : localize(step.label);
    stepDefinition.url = entity.url + "/step/" + step.name;
    return stepDefinition;
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
  entity.availableSteps = availableSteps;
}

/**
 * Database endpoint to read a single entity. 
 * @param studyName
 * @param role
 * @param identity
 * @param callback
 */
function getEntity(req, callback) {
  var studyName = req.params.study;
  var role = req.params.role;
  var identity = req.params.identity;
  MongoClient.connect("mongodb://localhost:27017/tracker", function(err, db) {
    
    // First find the study
    db.collection("studies", function(err, studies) {
      studies.find({name: studyName}, {_id: 1, name: 1}).limit(1).toArray(function(err, docs) {
        var doc = docs[0];
        var studyId = new BSON.ObjectID(doc._id.toString());
        doc.url = "/studies/" + studyName;
        
        var selector = {"studyId": studyId, "role" : role};
        if (identity.substr(0, 3) === "id;") {
          selector["_id"] = new BSON.ObjectID(identity.substr(3));
        } else {
          selector["identity"] = identity;
        }
        
        // Now locate the requested entity
        db.collection("entities", function(err, entities) {
          var cursor = entities.find(selector);
          cursor.toArray(function(err, results) {
            
            // And build the response
            var entity = results[0];
            entity.study = doc;
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
                
                // And finally, related entities. We can reuse the collection here...
                var relatedSelector = {"steps.fields.ref": new BSON.ObjectID(entity._id.toString())};
                entities.find(relatedSelector).toArray(function(err, related) {
                  
                  buildRelatedEntities(entity, related);

                  // Add in the step-based field definitions
                  buildEntityValues(entity, stepsArray);
                
                  // Send it back
                  callback(db, err, {data: entity});
                });
              });
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
function getViews(req, callback) {
  var name = req.params.study;
  var role = req.params.role;
  MongoClient.connect("mongodb://localhost:27017/tracker", function(err, db) {
    
    // As always, first locate the study
    db.collection("studies", function(err, studies) {
      studies.find({name: name}).limit(1).toArray(function(err, docs) {
        var doc = docs[0];
        var selector = {"studyId": new BSON.ObjectID(doc._id.toString()), "role" : role};
        
        // Now collect the views
        db.collection("views", function(err, views) {
          var cursor = views.find(selector);
          cursor.toArray(function(err, results) {
            results.sort(compareViews);
            callback(db, err, {data: results});
          });
        });
      });
    });
  });
}
    
module.exports.getViews = getViews;

function getEntityStepWithEntity(req, callback, db, studyId, entity) {
  var role = req.params.role;
  var stepName = req.params.step;
  
  
  // Find all the referenced step identifiers
  var stepSelector = {"studyId" : studyId, "appliesTo" : role, "name" : stepName };
  // Now locate the requested entity
  console.error("getEntityStepWithEntity", stepSelector, entity);
  db.collection("steps", function(err, steps) {
    steps.find(stepSelector).toArray(function(err, stepsArray) {
      var step = stepsArray[0];
      if (! step) {
        return callback(db, err, {data: step});
      }
      
      step.label = localize(step.label);
      
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
      
      var fields = step.fields || {};
      Object.keys(fields).forEach(function(fieldKey) {
        step.fields[fieldKey].label = localize(step.fields[fieldKey].label);
        step.fields[fieldKey].value = stepValues[fieldKey];
      });
      
      entity.step = step;
      callback(db, err, {data: entity});
    });
  });
}

function getEntityStep(req, callback) {
  var studyName = req.params.study;
  var role = req.params.role;
  var identity = req.params.identity;
  MongoClient.connect("mongodb://localhost:27017/tracker", function(err, db) {
    
    // First find the study
    db.collection("studies", function(err, studies) {
      studies.find({name: studyName}, {_id: 1, name: 1}).limit(1).toArray(function(err, docs) {
        var doc = docs[0];
        var studyId = new BSON.ObjectID(doc._id.toString());
        doc.url = "/studies/" + studyName;
        
        var entityModifier = function(entity) {
          entity.study = doc;
          entity.url = doc.url + "/" + role + "/" + identity;
          return entity;
        };
        
        var selector = {"studyId": studyId, "role" : role};
        if (identity.substr(0, 3) === "id;") {
          var rest = identity.substr(3);
          if (rest == "new") {
            var entity = {};
            return getEntityStepWithEntity(req, callback, db, studyId, entityModifier(entity));
          } else {
            selector["_id"] = new BSON.ObjectID(rest);
          }
        } else {
          selector["identity"] = identity;
        }
        
        console.error("getEntityStep", selector);
          
        db.collection("entities", function(err, entities) {
          var cursor = entities.find(selector);
          cursor.toArray(function(err, results) {
            return getEntityStepWithEntity(req, callback, db, studyId, entityModifier(results[0]));
          });
        });
      });
    });
  });
}

module.exports.getEntityStep = getEntityStep;

// Under some circumstances, we want a quick way to list the identities and 
// references for a set of entities with a given role in a study. This is
// primarily used for dropdowns and the like. We don't need full field 
// expansion or management to do this, a brief two-step (study then entities)
// query should suffice. 

function getEntities(req, callback) {
  var studyName = req.params.study;
  var role = req.params.role;
  var filter = req.query ? req.query["q"] : "^"
  MongoClient.connect("mongodb://localhost:27017/tracker", function(err, db) {
    
    // First find the study
    db.collection("studies", function(err, studies) {
      studies.find({name: studyName}, {_id: 1, name: 1}).limit(1).toArray(function(err, docs) {
        var doc = docs[0];
        doc.url = "/studies/" + studyName;
        var selector = {"studyId": new BSON.ObjectID(doc._id.toString()), "role" : role};
        if (filter) {
          selector["identity"] = { "$regex" : filter, "$options" : "i" };
        }
        
        // Now locate the requested entity
        db.collection("entities", function(err, entities) {
          var cursor = entities.find(selector);
          cursor.toArray(function(err, results) {
            
            callback(db, err, {data: results});
          });
        });
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

function buildStepUpdater(body) {
  var fields = body.data.step.fields || {};
  
  var newIdentity = undefined;
  var result = Object.keys(fields).map(function(fieldKey) {
    var fieldData = {"key" : fieldKey};
    if (fields[fieldKey].identity) {
      fieldData["identity"] = fields[fieldKey].value;
      newIdentity = fieldData["identity"];
    } else {
      fieldData["value"] = fields[fieldKey].value;
    }
    return fieldData;
  });
  
  result = {"$set" : {"steps.$.fields": result, "steps.$.stepDate" : new Date().toISOString()}};
  
  // If we've set an identity value, make sure that's also set.
  if (newIdentity) {
    result["$set"]["identity"] = newIdentity;
  };
  
  return result
}

// Now we can handle some of the additional logic in handling a POST
// request. We have to handle entities as we do with a GET request. The 
// special cases involve the handling of the stepOptions field. That tells
// us what to do. If the method is set to CreateEntity, we should make a new
// entity, i.e. do an upsert. Some values in some fields can be set (actually
// this needs to happen for a GET request, too, at least for display reasons)
// and then we can build a new entity and create the wee beauty. 

function postEntityStepWithEntity(req, callback, db, studyId, entity) {
  var role = req.params.role;
  var stepName = req.params.step;
  
  //console.error("Body", JSON.stringify(req.body, null, 2));
  
  // Find the referenced step 
  var stepSelector = {"studyId" : studyId, "appliesTo" : role, "name" : stepName };
  
  // This is the tricky bit, as we need to locate the step, which we will typically
  // do by identifier. Some steps can be run more than once, others not. We need to
  // build that in as part of the step definition. A typical example of the multiple
  // is creating a sample. We also need to plan how to attach creating a sample to a
  // participant. 
  //
  // And finally, we also need to return the data block consistently, so that even 
  // when we do actually get data back, we get it consistently. This would be a great
  // time to do some TDD.
  
  db.collection("steps", function(err, steps) {
    steps.find(stepSelector).toArray(function(err, stepsArray) {
      var step = stepsArray[0];
      //console.error("Found step: ", JSON.stringify(step, null, 4));
      step.label = localize(step.label);
      
      Object.keys(step.fields).forEach(function(fieldKey) {
        step.fields[fieldKey].label = localize(step.fields[fieldKey].label);
      });
      
      // Step 1. Attempt to update an existing step. If we get back evidence that
      // this did change something, then we are good to go with the callback.
      
      var entityStepSelector = {"studyId" : studyId, "role" : role, "identity" : stepName };
      var entityStepUpdater = buildStepUpdater(req.body);
      
      //console.log("About to update: ", JSON.stringify(entity, null, 2), JSON.stringify(entityStepSelector, null, 2), JSON.stringify(entityStepUpdater, null, 2));
      
      db.collection("entities", function(err, entities) {
        entities.update(entityStepSelector, entityStepUpdater)
      
        entity.step = step;
        callback(db, err, {data: entity});
        
      });
    });
  });
}

function postEntityStep(req, callback) {
  var studyName = req.params.study;
  var role = req.params.role;
  var identity = req.params.identity;
  var stepName = req.params.step;
  
  MongoClient.connect("mongodb://localhost:27017/tracker", function(err, db) {

    // First find the study
    db.collection("studies", function(err, studies) {
      studies.find({name: studyName}, {_id: 1, name: 1}).limit(1).toArray(function(err, docs) {
        var doc = docs[0];
        var studyId = new BSON.ObjectID(doc._id.toString());
        doc.url = "/studies/" + studyName;
        
        // Find the referenced step 
        var stepSelector = {"studyId" : studyId, "appliesTo" : role, "name" : stepName };
        db.collection("steps", function(err, steps) {
          steps.find(stepSelector).toArray(function(err, stepsArray) {
            var step = stepsArray[0];
            
            var existingEntityStepSelector = {
              "studyId" : studyId, 
              "role" : role, 
              "identity" : identity, 
              "steps.stepRef" : new BSON.ObjectID(step._id.toString())
            };
            var existingEntityStepUpdater = buildStepUpdater(req.body);
            
            // Now we can proceed to do something like an update. If we can haz a step id, 
            // we can start with an update. That will fail either (a) because we failed
            // to find a document, or we failed to have a step. It would be great if
            // MongoDB could tell us which, and to an extent, it probably can. We try with
            // several stages, although we probably need to lock the hell out of this. 
            // Fortunately, each is atomic, and that is a good start, especially since
            // we can guard each an extent. 
            
            db.collection("entities", function(err, entities) {
              //entities.update(entityStepSelector, entityStepUpdater)
              
              var entityCallback = function() {
                var newIdentity = (existingEntityStepUpdater["$set"]["identity"] || identity);
                var selector = {"studyId" : studyId, "role" : role, "identity" : newIdentity};
                var cursor = entities.find(selector);
                var entityModifier = function(entity) {
                  entity.study = doc;
                  entity.url = doc.url + "/" + role + "/" + newIdentity;
                  entity.alerts = [{level: "info", body: "Step updated successfully", date: new Date().toLocaleString()}];
                  return entity;                  
                };
                cursor.toArray(function(err, results) {
                  return getEntityStepWithEntity(req, callback, db, studyId, entityModifier(results[0]));
                });
              };
              
              //console.error("Try", JSON.stringify({existingEntityStepSelector: existingEntityStepSelector, existingEntityStepUpdater: existingEntityStepUpdater}, null, 2))
              entities.update(existingEntityStepSelector, existingEntityStepUpdater, {"fsync" : true, "w" : 1}, function (err, result) {
                //console.error("Update step 1 result", JSON.stringify({err: err, result: result}, null, 2))
                
                // Now if result == 1 we changed something. If result == 0, we didn't, and
                // need to actually do something about it. That could mean that the step didn't exist, 
                // or that the entity didn't exist. We can handle entities that didn't exist
                // later, as really should 404. 
                
                if (result == 0) {
                  existingEntityStepUpdater = {"$push": {"steps": {
                    "stepRef" : existingEntityStepSelector['steps.stepRef'],
                    "id" : new BSON.ObjectID(),
                    "fields" : existingEntityStepUpdater["$set"]["steps.$.fields"],
                    "stepDate" : existingEntityStepUpdater["$set"]["steps.$.stepDate"]
                  }}};
                  delete existingEntityStepSelector['steps.stepRef'];
                  
                  //console.error("Retry", JSON.stringify({existingEntityStepSelector: existingEntityStepSelector, existingEntityStepUpdater: existingEntityStepUpdater}, null, 2))

                  entities.update(existingEntityStepSelector, existingEntityStepUpdater, {"fsync" : true, "w" : 1}, function (err, result) {
                    entityCallback();
                  });
                } else {
                  entityCallback();
                }
              });
            });
          });
        });

        
//        if (role === "Global") {
//          identity = role;
//          var entity = {};
//          entity.study = doc;
//          entity.url = doc.url + "/" + role + "/" + identity;
//          return postEntityStepWithEntity(req, callback, db, studyId, entity);
//        }
//
//        var selector = (identity.substr(0, 3) === "id;") 
//          ? {"studyId": studyId, "role" : role, "_id" : new BSON.ObjectID(identity.substr(3)) }
//          : {"studyId": studyId, "role" : role, "identity" : identity};
//          
//        // Now locate the requested entity
//        db.collection("entities", function(err, entities) {
//          var cursor = entities.find(selector);
//          cursor.toArray(function(err, results) {
//            
//            // And build the response
//            var entity = results[0];
//            entity.study = doc;
//            entity.url = doc.url + "/" + role + "/" + identity;
//            
//            postEntityStepWithEntity(req, callback, db, studyId, entity);
//          });
//        });
        
      });
    });

  });
}

module.exports.postEntityStep = postEntityStep;
