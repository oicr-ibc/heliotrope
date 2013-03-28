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
  return localizableData["default"];
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
    stepDefinition.label = localize(step.label);
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
    
    if (record.hasOwnProperty("value")) {
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
        doc.url = "/studies/" + studyName;
        var selector = (identity.substr(0, 3) === "id;") 
          ? {"studyId": new BSON.ObjectID(doc._id.toString()), "role" : role, "_id" : new BSON.ObjectID(identity.substr(3)) }
          : {"studyId": new BSON.ObjectID(doc._id.toString()), "role" : role, "identity" : identity};
        
        // Now locate the requested entity
        db.collection("entities", function(err, entities) {
          var cursor = entities.find(selector);
          cursor.toArray(function(err, results) {
            
            // And build the response
            var entity = results[0];
            entity.study = doc;
            entity.url = doc.url + "/" + role + "/" + identity;
             
            // Find all the referenced step identifiers
            var stepSelector = {"_id" : {"$in" : getEntityStepIds(entity).map(function(id) { return new BSON.ObjectID(id); }) }};
            
            // Now locate the requested entity
            db.collection("steps", function(err, steps) {
              steps.find(stepSelector).toArray(function(err, stepsArray) {
                
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

function getEntityStep(req, callback) {
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
        var selector = (identity.substr(0, 3) === "id;") 
          ? {"studyId": studyId, "role" : role, "_id" : new BSON.ObjectID(identity.substr(3)) }
          : {"studyId": studyId, "role" : role, "identity" : identity};
        
        // Now locate the requested entity
        db.collection("entities", function(err, entities) {
          var cursor = entities.find(selector);
          cursor.toArray(function(err, results) {
            
            // And build the response
            var entity = results[0];
            entity.study = doc;
            entity.url = doc.url + "/" + role + "/" + identity;
            
            // Find all the referenced step identifiers
            var stepSelector = {"studyId" : studyId, "ownerType" : role, "name" : stepName };
            // Now locate the requested entity
            db.collection("steps", function(err, steps) {
              steps.find(stepSelector).toArray(function(err, stepsArray) {
                var step = stepsArray[0];
                step.label = localize(step.label);
                Object.keys(step.fields).forEach(function(fieldKey) {
                  step.fields[fieldKey].label = localize(step.fields[fieldKey].label);
                });
                entity.step = step;
                callback(db, err, {data: entity});
              });
            });
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
  var filter = req.query["q"]
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
  var fields = body.data.step.fields;
  
  var result = Object.keys(fields).map(function(fieldKey) {
    return {"key" : fieldKey, "value" : fields[fieldKey].value};
  });
  
  result = {"$set" : {"steps.$.fields": result}};
  
  console.log("Step updater", JSON.stringify(result, null, 4));
  result;
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
        var selector = (identity.substr(0, 3) === "id;") 
          ? {"studyId": studyId, "role" : role, "_id" : new BSON.ObjectID(identity.substr(3)) }
          : {"studyId": studyId, "role" : role, "identity" : identity};
          
        
        // Now locate the requested entity
        db.collection("entities", function(err, entities) {
          var cursor = entities.find(selector);
          cursor.toArray(function(err, results) {
            
            // And build the response
            var entity = results[0];
            entity.study = doc;
            entity.url = doc.url + "/" + role + "/" + identity;
            
            // Find the referenced step 
            var stepSelector = {"studyId" : studyId, "ownerType" : role, "name" : stepName };
            var stepUpdater = buildStepUpdater(req.body);
           
            db.collection("steps", function(err, steps) {
              steps.find(stepSelector).toArray(function(err, stepsArray) {
                var step = stepsArray[0];
                step.label = localize(step.label);
                Object.keys(step.fields).forEach(function(fieldKey) {
                  step.fields[fieldKey].label = localize(step.fields[fieldKey].label);
                });
                entity.step = step;
                callback(db, err, {data: entity});
              });
            });
          });
        });
      });
    });

  });
}

module.exports.postEntityStep = postEntityStep;
