var sys = require("sys"),
    assert = require("assert"),
    genomics = require("./genomics"),
    polyfill = require("./polyfill"),
    mongo = require("mongodb"),
    BSON = mongo.BSONPure,
    MongoClient = mongo.MongoClient,
    knowledgeCharts = require("./knowledgeCharts");

function connected(url, callback) {
  return function(req, res) {
    MongoClient.connect(url, function (err, db) {
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
 * Updates/creates a variant. This is used to store new variants created from VCF files. 
 * There is a significant amount of basic data needed for a single variant. Each must include, at
 * a minimum, the fields below. All of these can be derived from a properly managed use of the
 * Ensembl variant effect predictor. The fields are validated fairly thoroughly in terms of their
 * existence, but no semantic checking or consistency checks are applied. 
 * <p>
 * <ul>
 * <li>variantType - the variant type, always "mutation"
 * <li>shortMutation - e.g., "p.D1208Y" (optional)
 * <li>consequence - e.g., "missense_variant"
 * <li>name - e.g., "NPHS1 p.Asp1208Tyr" (optional)
 * <li>gene - e.g, "NPHS1"
 * <li>geneId - e.g., "ENSG00000161270
 * <li>mutation - e.g., "p.Asp1208Tyr"
 * <li>type - e.g., "variant"
 * <li>shortName - e.g., "NPHS1 p.D1208Y" (optional)
 * </ul>
 * <p>
 * All remaining data for a variant is pushed into the first positions record. It will typically
 * contain at least the following fields. Note that the database stores more information, and 
 * will typically complete it from the core data included above. Some of these are required. 
 * The core issue is how we RESTfully sensibly allow multiple items to be created. 
 * <p>
 * <ul>
 * <li>sift - e.g., { "level" : "tolerated", "score" : 0.07 } (optional)
 * <li>polyphen - e.g., { "level" : "benign", "score" : 0.002 } (optional)
 * <li>stop - e.g., "36317520"
 * <li>HGVSc - e.g., "c.3622G>T"
 * <li>cdsPosition - e.g., "3622"
 * <li>HGVSp - e.g., "p.Asp1208Tyr" (optional)
 * <li>codon - e.g., "1208"
 * <li>transcript - e.g., "ENST00000378910"
 * <li>HGVSpr - e.g., "p.D1208Y" (optional)
 * <li>chromosome - e.g., "19"
 * <li>exon - e.g., "29"
 * <li>start - e.g., "36317520"
 * </ul>
 * 
 * @param err error flag from the database connection
 * @param db the database connection
 * @param req the request
 * @param res the response
 * @param callback
 */

var requiredFields = ["consequence", "type", "gene", "geneId", "mutation", "transcript", "start", "stop"];
var integerFields = ["start", "stop", "exon", "codon", "cdsPosition"];
var primaryFields = ["variantType", "shortMutation", "consequence", "name", "gene", "geneId", "mutation", "type", "shortName"]

function postVariant(err, db, req, res, callback) {
  var body = req.body;

  var data = req.body.data;
  var errors = [];

  // Now we can do some basic validation. 
  function validateRequiredField(field) {
    if (! data[field]) 
      errors.push("Missing field: " + field);
  }

  function validateIntegerField(field) {
    var value = data[field];
    if (typeof value === 'string') {
      var parsed = parseInt(value);
      if (parsed === NaN) 
        errors.push("Invalid value for field: " + field + " (value: " + value.toString() + ")");
      else 
        data[field] = parsed;
    } else if (value && typeof value !== 'number') {
      errors.push("Invalid value for field: " + field + " (value: " + value.toString() + ")");
    }
  }

  requiredFields.forEach(validateRequiredField);
  integerFields.forEach(validateIntegerField);

  if (errors.length > 0)
    return callback(db, {error: errors.join(", ")}, {}, res);

  // Complete inferred values
  if (! data["shortMutation"])
   data["shortMutation"] = genomics.convertNamesToCodes(data["mutation"]);
  if (! data["name"])
    data["name"] = data["gene"] + " " + data["mutation"];
  if (! data["shortName"]) 
    data["shortName"] = data["gene"] + " " + data["shortMutation"];

  // And finally, we want to restructure this into a statement that we can use to do a safe insert. Do this using a
  // standard MongoDB insert, which ought to get rejected if we have an existing variant with that name. This is a
  // key requirement. We have a unique and safe index on the name field for the variants collection, which ought to be
  // enough. That index is ensured below. 

  var record = {};
  primaryFields.forEach(function(field) {
    record[field] = data[field];
    delete data[field];
  });
  record["sections"] = {};
  record["sections"]["positions"] = {};
  record["sections"]["positions"]["data"] = [];
  var position = {};
  record["sections"]["positions"]["data"].push(position);
  Object.keys(data).forEach(function(field) {
    if (data.hasOwnProperty(field)) 
      position[field] = data[field];
  });

  record["version"] = 1;

  assert(record["name"], "Internal error: missing name");

  // Finally, we need to make the reference to the gene. Best way to do this is to use the Ensembl gene identifier.
  // Now we're into MongoDB territory. 

  var geneSelector = {id: record["geneId"]};
  db.collection("genes", function(err, genes) {
    genes.find(geneSelector).limit(1).toArray(function(err, docs) {
      if (err || docs.length === 0) 
        return callback(db, {error: "Failed to find gene: " + record["geneId"]}, {}, res);

      record["genesRidx"] = 0;
      record["references"] = [{
        "_id" : docs[0]._id,
        "ref" : "genes",
        "name" : docs[0].name
      }];

      var insertOptions = {"fsync" : true, "w" : 1};
      db.collection("variants", function(err, variants) {
        variants.insert(record, insertOptions, function(err, result) {
          if (err) {
            if (err.code === 11000) 
              return callback(db, {error: err}, {}, res, 403);
            return callback(db, {error: err}, {}, res);
          }
          var url = "/variants/" + encodeURIComponent(record["shortName"]);
          return callback(db, null, url, res);
        });
      });
    });
  });
}

module.exports.postVariant = postVariant;

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

/**
 * Defines and returns the pipeline for the gene frequencies query. There is some room
 * form performance tuning here, if we figure out what we actually want to return. 
 */
function getGeneFrequenciesPipeline() {
  return [{"$match" : {"sections.frequencies.data.all.total" : {"$gt" : 1000}}},
          {"$project" : {"name" : 1, "frequency" : "$sections.frequencies.data.all"}},
          {"$unwind" : "$frequency"},
          {"$sort" : {"frequency.frequency" : -1}},
          {"$limit" : 250}];
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
      var name = components[0].toUpperCase();
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
      {"collection" : "variants", "index" : { "shortMutation" : 1 }},
      {"collection" : "variants", "index" : { "name" : 1 }, "options" : {"unique" : true }},
      {"collection" : "variants", "index" : { "gene" : 1 }},
      {"collection" : "genes",    "index" : { "sections.frequencies.data.all.total" : 1 }}
    ];
    function addIndexes() {
      if (indexes.length == 0) {
        return;
      } else {
        var index = indexes.shift();
        if (index["options"]) 
          return db.ensureIndex(index["collection"], index["index"], index["options"], addIndexes);
        else
          return db.ensureIndex(index["collection"], index["index"], addIndexes);
      }
    };
    addIndexes();
  });
}
  
module.exports.initialize = init;
