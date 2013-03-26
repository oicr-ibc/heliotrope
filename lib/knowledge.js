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
      genes.findOne({name: name}, function(err, doc) {
        db.collection("variants", function(err, variants) {
          variants.aggregate(getCommonMutationsPipeline(name), function(err, commonMutations) {
            
            var resolved = resolve(doc);
            resolved.url = "/genes/" + name;
            var result = new Object;
            result["data"] = resolved;
            
            var mutations = new Object;
            mutations["data"] = commonMutations;

            result["data"]["sections"]["mutations"] = mutations;
          
            callback(db, err, result);
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
