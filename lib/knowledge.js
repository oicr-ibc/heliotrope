var mongo = require("mongodb"),
    BSON = mongo.BSONPure,
    MongoClient = mongo.MongoClient;

function resolveRelation(offset, relations) {
  return relations[offset];
}

function resolveArray(list, relations) {
  return list.map(function(element) { return resolveValue(element, relations); });
}

function resolveObject(object, relations) {
  var result = {};
  for (var key in object) { 
    if (key.substr(-4, 4) === "Ridx") {
      var newKey = key.slice(0, -4) + "Refx";
      result[newKey] = resolveRelation(object[key], relations);
    } else {
      result[key] = resolveValue(object[key], relations);
    }
  }
  return result;
}

function resolveValue(value, relations) {
  if (value == null) {
    return value;
  } else if (value instanceof Array) {
    return resolveArray(value, relations);
  } else if (typeof value === 'object') {
    return resolveObject(value, relations);
  } else {
    return value;
  }
}

function resolve(object) {
  if (typeof object === 'object') {
    var references = object["references"];
    delete object["references"];
    return resolveValue(object, references);
  } else {
    return object;
  }
}

/**
 * Finding the common mutations for a gene is a slightly interesting process, but
 * it's a lot easier in JS than in Scala :-). 
 */
function getCommonMutationsPipeline(geneName) {
  return [{"$match"    : {"gene" : geneName }},
          {"$project"  : {"_id" : 1, "mutation" : 1, "affected" : "$sections.frequencies.data.tumour.affected"}},
          {"$unwind"   : "$affected" },
          {"$group"    : { "_id" : "$mutation", "ref" : {"$min" : "$_id"}, "total" : {"$sum" : "$affected"}}},
          {"$project"  : {"name" : "$_id", "_id" : "$ref", "total" : 1}},
          {"$sort"     : {"total" : -1}},
          {"$limit"    : 10}];
}

/**
 * Database endpoint to read a single study. This should also read a set of the 
 * related entities of all types. 
 * @param name - the name of the study
 * @param callback - function accepting (err, doc, db)
 */
function getGene(req, callback) {
  var name = req.params.gene;
  MongoClient.connect("mongodb://localhost:27017/heliotrope", function(err, db) {
    db.collection("genes", function(err, genes) {
      
      if (err) { return callback(db, err, {}); }
      
      genes.find({name: name}).limit(1).toArray(function(err, docs) {

        if (err) { return callback(db, err, {}); }
        if (docs.length < 1) {
          return callback(db, {err: "no such object: " + name}, "", 404);
        }
        var doc = docs[0];
        
        db.collection("variants", function(err, variants) {
          variants.aggregate(getCommonMutationsPipeline(name), function(err, commonMutations) {
            
            var resolved = resolve(doc);
            resolved.url = "/genes/" + name;
            var result = new Object;
            result["data"] = resolved;
            
            var mutations = new Object;
            mutations["data"] = commonMutations;

            result["data"]["sections"]["mutations"] = mutations;
          
            return callback(db, err, result);
          });
        });
      });
    });
  });
}


module.exports.getGene = getGene;

function getVariant(req, callback) {
  var id = req.params.id;
  MongoClient.connect("mongodb://localhost:27017/heliotrope", function(err, db) {
    db.collection("variants", function(err, variants) {
      variants.findOne({_id: new BSON.ObjectID(id)}, function(err, doc) {
        var resolved = resolve(doc);
        resolved.url = "/variants/" + id;
        
        var result = new Object;
        result["data"] = resolved;

        callback(db, err, result);
      });
    });
  });
}
    
module.exports.getVariant = getVariant;

function getGeneFrequenciesPipeline() {
  return [{"$project" : {"name" : 1, "frequency" : "$sections.frequencies.data.all"}},
          {"$unwind" : "$frequency"},
          {"$match" : {"frequency.total" : {"$gt" : 1000}}},
          {"$sort" : {"frequency.frequency" : -1}},
          {"$limit" : 100}];
}

function executeQuery(req, callback) {
  var name = req.params.query;
  MongoClient.connect("mongodb://localhost:27017/heliotrope", function(err, db) {
    db.collection("genes", function(err, genes) {
      genes.aggregate(getGeneFrequenciesPipeline(), function(err, commonGenes) {
        var result = new Object;
        result["data"] = commonGenes;
        
        callback(db, err, result);
      });
    });
  });
}

module.exports.executeQuery = executeQuery;


function addGeneResults(db, query, result, callback) {
  db.collection("genes", function(err, genes) {
    var components = query.split(" ");
    if (components.length >= 1) {
      var name = components[0];
      genes.find({name: name}).limit(1).toArray(function(err, docs) {
        if (docs.length < 1) {
          return callback(db, query, result);
        } else {
          var doc = docs[0];
          var hit = new Object;
          hit["type"] = "gene";
          hit["url"] = "/genes/" + doc["name"];
          hit["name"] = doc["name"];
          hit["label"] = hit["name"];
          result["data"]["results"].push(hit);
          return callback(db, query, result);
        }
      });
    } else {
      return callback(db, query, result);
    }
  });
}

function addVariantResults(db, query, result, callback) {
  db.collection("variants", function(err, variants) {
    var components = query.split(" ");
    if (components.length >= 2) {
      var name = components[0];
      var mutation = components[1];
      if (! mutation.startsWith("p.")) {
        mutation = "p." + mutation;
      }
      variants.find({gene: name, shortMutation: mutation}).limit(1).toArray(function(err, docs) {
        if (docs.length < 1) {
          return callback(db, query, result);
        } else {
          var doc = docs[0];
          var hit = new Object;
          hit["type"] = "mutation";
          hit["url"] = "/variants/" + doc["_id"];
          hit["gene"] = doc["gene"];
          hit["mutation"] = doc["mutation"];
          hit["shortMutation"] = doc["shortMutation"];
          hit["label"] = hit["gene"] + " " + hit["shortMutation"] + " (" + hit["mutation"] + ")"
          result["data"]["results"].push(hit);
          return callback(db, query, result);
        }
      });
    } else {
      return callback(db, query, result);
    }
  });
}

/**
 * Handler for the search API. This accepts a single string and returns a set of
 * hits. The principle is fairly simple, we want to look to see if there is a 
 * space in the string, and if so, we behave a little differently. Each returned
 * result is tagged for display using some kind of a directive. 
 * 
 * @param req
 * @param callback
 */
function executeSearch(req, callback) {
  var query = req.query.q;
  var result = new Object;
  var response = new Object;
  
  response["query"] = query;
  response["results"] = [];
  result["data"] = response;
  
  MongoClient.connect("mongodb://localhost:27017/heliotrope", function(err, db) {
    query = query.trim();
    addGeneResults(db, query, result, function(db, query, result) {
      addVariantResults(db, query, result, function (db, query, result) {
        callback(db, err, result);      
      })
    });
  });
}

module.exports.executeSearch = executeSearch;

function init() {
  MongoClient.connect("mongodb://localhost:27017/heliotrope", function(err, db) {
    var indexes = [
      {"collection" : "variants", "index" : { "shortMutation" : 1 }}
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
