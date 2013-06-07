var sys = require("sys"),
    genomics = require("./genomics"),
    polyfill = require("./polyfill"),
    mongo = require("mongodb"),
    BSON = mongo.BSONPure,
    MongoClient = mongo.MongoClient,
    knowledgeCharts = require("./knowledgeCharts");

function connected(callback) {
  return function(req, res) {
    MongoClient.connect("mongodb://localhost:27017/heliotrope", function (err, db) {
      callback(err, db, req, res);
    });
  }
}

module.exports.connected = connected;

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
          {"$project"  : {"_id" : 1, "mutation" : 1, "shortMutation": 1, "gene": 1, "affected" : "$sections.frequencies.data.tumour.affected"}},
          {"$unwind"   : "$affected" },
          {"$group"    : { "_id" : {mutation: "$mutation", shortMutation: "$shortMutation", "gene": "$gene"}, "ref" : {"$min" : "$_id"}, "total" : {"$sum" : "$affected"}}},
          {"$project"  : {"name" : "$_id.mutation", "shortMutation" : "$_id.shortMutation", "gene": "$_id.gene", "_id" : "$ref", "total" : 1}},
          {"$sort"     : {"total" : -1}},
          {"$limit"    : 10}];
}

/**
 * Database endpoint to read a single study. This should also read a set of the 
 * related entities of all types. 
 * @param name - the name of the study
 * @param callback - function accepting (err, doc, db)
 */
function getGene(err, db, req, res, callback) {
  var name = req.params.gene;
  db.collection("genes", function(err, genes) {
    
    if (err) { return callback(db, err, {}, res); }
    
    genes.find({name: name}).limit(1).toArray(function(err, docs) {

      if (err) { return callback(db, err, {}, res); }
      if (docs.length < 1) {
        return callback(db, {err: "no such object: " + name}, "", res, 404);
      }
      var doc = docs[0];
      
      db.collection("variants", function(err, variants) {
        variants.aggregate(getCommonMutationsPipeline(name), function(err, commonMutations) {

          commonMutations.forEach(function(mutation) {
            mutation.url = "/variants/" + encodeURIComponent(mutation.gene + " " + mutation.shortMutation);
          })

          var resolved = resolve(doc);
          resolved.url = "/genes/" + name;
          var result = new Object;
          result["data"] = resolved;
          
          var mutations = new Object;
          mutations["data"] = commonMutations;

          result["data"]["sections"]["mutations"] = mutations;
        
          return callback(db, err, result, res);
        });
      });
    });
  });
}

module.exports.getGene = getGene;

function getVariantSelector(req) {
  var id = req.params.id.replace(/\+/, " ");

  var selector;
  var components = id.split(" ");
  if (components.length >= 2) {
    var name = components[0];
    var mutation = components[1];
    mutation = genomics.convertNamesToCodes(mutation);
    if (! mutation.substring("p.")) {
      mutation = "p." + mutation;
    }
    selector = {gene: name, shortMutation: mutation};
  } else {
    selector = {_id: new BSON.ObjectID(id)};
  }

  return selector;
}


/**
 * Retrieves a variant. The endpoint also looks up a little gene information and implants
 * that into the response where appropriate. 
 * @param req
 * @param callback
 */

function findVariant(err, db, variants, selector, res, callback) {
  variants.find(selector).limit(1).toArray(function(err, docs) {
    
    if (err) { return callback(db, err, {}, res); }
    if (docs.length < 1) {
      return callback(db, {err: "no such object: " + selector.toString()}, "", res, 404);
    }
    
    var doc = docs[0];
    var resolved = resolve(doc);
    resolved.url = "/variants/" + encodeURIComponent(doc.shortName);
    
    var result = new Object;
    result["data"] = resolved;

    var geneId = resolved["genesRefx"]["_id"].toHexString();
    db.collection("genes", function(err, genes) {
      genes.find({_id: new BSON.ObjectID(geneId)}).limit(1).toArray(function(err, geneDocs) {
        if (err) { return callback(db, err, {}); }
        if (geneDocs.length < 1) {
          return callback(db, {err: "no such gene: " + geneId}, "", res, 404);
        }
        
        result["data"]["sections"]["distribution"] = geneDocs[0]["sections"]["distribution"];
        result["data"]["sections"]["transcripts"] = geneDocs[0]["sections"]["transcripts"];
        callback(db, err, result, res);
      });
    });
  });
}

function getVariant(err, db, req, res, callback) {
  var selector = getVariantSelector(req);

  db.collection("variants", function(err, variants) {
    findVariant(err, db, variants, selector, res, callback);
  });
}

module.exports.getVariant = getVariant;

/**
 * Retrieves a variant report. The endpoint also looks up a little gene information and implants
 * that into the response where appropriate. 
 * @param req
 * @param callback
 */

function getVariantReport(err, db, req, res, callback) {
  getVariant(err, db, req, res, function(db, err, result, res) {
    var geneId = result["data"]["genesRefx"]["_id"];
    db.collection("genes", function(err, genes) {
      genes.find({_id: geneId}).limit(1).toArray(function(err, geneDocs) {
        if (err) { return callback(db, err, {}); }
        if (geneDocs.length !== 1) { return callback(db, {err: "Missing gene" + geneId}, {}, res)}
        result["data"]["genesRefx"]["_body"] = resolve(geneDocs[0]);
        result["data"]["chart"] = knowledgeCharts.getVariantChartSVG(result);
        return callback(db, err, result, res);
      })
    });
  })
};
 
module.exports.getVariantReport = getVariantReport;

/**
 * Updates a variant. This is used to save updates from the front end. 
 * @param req
 * @param callback
 */

function putVariant(err, db, req, res, callback) {
  var selector = getVariantSelector(req);
  var body = req.body;

  db.collection("variants", function(err, variants) {

    // We don't need to update everything, but we should replace certain sections, and primarily
    // everything clinical, since that's typically been annotated. We could be sloppy and just replace
    // the whole darned thing, but that's possibly risky if someone messes about with the client
    // data somehow.

    var update = {};
    update["$set"] = {};
    update["$set"]["sections.clinical.data.action"] = body.data.sections.clinical.data.action;
    update["$set"]["sections.clinical.data.agents"] = body.data.sections.clinical.data.agents;
    update["$set"]["sections.clinical.data.significance"] = body.data.sections.clinical.data.significance;

    update["$push"] = {};
    update["$push"]["sections.clinical.data.history"] = {
      "modifiedDate" : new Date(),
      "modifiedBy" : req.user || "anonymous"
    };

    variants.update(selector, update, {upsert:false, multi: false, w: 1}, function(err, result) {

      if (err) { return callback(db, err, {}); }
      if (result !== 1) { return callback(db, {err: "Internal error: failed to update: " + selector.toString()}, {}); }

      // And here we have a newly updated item, so we can redo the variant request, using our
      // existing code. 

      return findVariant(err, db, variants, selector, res, callback);
    });
  });
}

module.exports.putVariant = putVariant;

function getGeneFrequenciesPipeline() {
  return [{"$project" : {"name" : 1, "frequency" : "$sections.frequencies.data.all"}},
          {"$unwind" : "$frequency"},
          {"$match" : {"frequency.total" : {"$gt" : 1000}}},
          {"$sort" : {"frequency.frequency" : -1}},
          {"$limit" : 100}];
}

function executeQuery(err, db, req, res, callback) {
  var name = req.params.query;
  db.collection("genes", function(err, genes) {
    genes.aggregate(getGeneFrequenciesPipeline(), function(err, commonGenes) {
      var result = new Object;
      result["data"] = commonGenes;
      
      callback(db, err, result, res);
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
      mutation = genomics.convertNamesToCodes(mutation);
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
          hit["url"] = "/variants/" + encodeURIComponent(doc["shortName"]);
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
function executeSearch(err, db, req, res, callback) {
  var query = req.query.q;
  var result = new Object;
  var response = new Object;
  
  response["query"] = query;
  response["results"] = [];
  result["data"] = response;
  
  query = query.trim();
  addGeneResults(db, query, result, function(db, query, result) {
    addVariantResults(db, query, result, function (db, query, result) {
      callback(db, err, result, res);      
    })
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
