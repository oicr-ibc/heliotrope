module.exports.log4js = module.parent.exports.log4js
module.exports.logger = module.parent.exports.logger

mongo =           require("mongodb")
MongoClient =     mongo.MongoClient


module.exports.connected = (url, callback) ->
  (req, res) ->
    MongoClient.connect url, (err, db) ->
      callback err, db, req, res

module.exports.initialize = () ->
  MongoClient.connect "mongodb://localhost:27017/heliotrope", (err, db) ->
    indexes = [
      {"collection" : "variants", "index" : { "shortMutation" : 1 }}
      {"collection" : "variants", "index" : { "name" : 1 }, "options" : {"unique" : true }}
      {"collection" : "variants", "index" : { "gene" : 1 }}
      {"collection" : "genes",    "index" : { "sections.frequencies.data.all.total" : 1 }}
    ]

    addIndexes = () ->
      if indexes.length > 0
        index = indexes.shift()
        if index["options"]
          db.ensureIndex index["collection"], index["index"], index["options"], addIndexes
        else
          db.ensureIndex index["collection"], index["index"], addIndexes

    addIndexes()


module.exports.executeQuery = (err, db, req, res, callback) ->
  name = req.params.query
  db.collection "genes", (err, genes) ->

    # Defines and returns the pipeline for the gene frequencies query. There is some room
    # for performance tuning here, if we figure out what we actually want to return.
    geneFrequenciesPipeline = [
      {"$match" : {"sections.frequencies.data.all.total" : {"$gt" : 1000}}},
      {"$project" : {"name" : 1, "frequency" : "$sections.frequencies.data.all"}},
      {"$unwind" : "$frequency"},
      {"$sort" : {"frequency.frequency" : -1}},
      {"$limit" : 250}
    ]

    genes.aggregate geneFrequenciesPipeline, (err, commonGenes) ->
      result = new Object
      result["data"] = commonGenes;
      callback db, err, result, res, 200

## Object resolution functions. These walk an object and convert from indexed
## to embedded relation references. This happens server-side.
resolveRelation = (offset, relations) ->
  relations[offset]

resolveArray = (list, relations) ->
  resolveValue(element, relations) for element in list

resolveObject = (object, relations) ->
  result = {}
  for own key, value of object
    if key.substr(-4, 4) == "Ridx"
      newKey = key.slice(0, -4) + "Refx"
      result[newKey] = resolveRelation(object[key], relations)
    else
      result[key] = resolveValue(object[key], relations)
  result

resolveValue = (value, relations) ->
  if value == null
    value
  else if value instanceof Array
    resolveArray(value, relations)
  else if typeof value == 'object'
    resolveObject(value, relations)
  else
    value

resolve = (object) ->
  if typeof object == 'object'
    references = object["references"]
    delete object["references"]
    resolveObject(object, references)
  else
    object


## Database endpoint to read a single study. This should also read a set of the
## related entities of all types.
## @param name - the name of the study
## @param callback - function

module.exports.getGene = (err, db, req, res, callback) ->
  name = req.params.gene
  db.collection "genes", (err, genes) ->
    if err then return callback db, err, {}, res
    genes.find({name: name}).limit(1).toArray (err, docs) ->

      if err then return callback db, err, {}, res
      if docs.length < 1 then return callback db, {err: "no such object: " + name}, "", res, 404
      doc = docs[0]

      db.collection "variants", (err, variants) ->

        getCommonMutationsPipeline = (geneName) ->
          [{"$match"    : {"gene" : geneName }},
           {"$project"  : {"_id" : 1, "mutation" : 1, "shortMutation": 1, "gene": 1, "affected" : "$sections.frequencies.data.tumour.affected"}},
           {"$unwind"   : "$affected" },
           {"$group"    : { "_id" : {mutation: "$mutation", shortMutation: "$shortMutation", "gene": "$gene"}, "ref" : {"$min" : "$_id"}, "total" : {"$sum" : "$affected"}}},
           {"$project"  : {"name" : "$_id.mutation", "shortMutation" : "$_id.shortMutation", "gene": "$_id.gene", "_id" : "$ref", "total" : 1}},
           {"$sort"     : {"total" : -1}},
           {"$limit"    : 10}]

        variants.aggregate getCommonMutationsPipeline(name), (err, commonMutations) ->

          for mutation in commonMutations
            mutation.url = "/variants/" + encodeURIComponent(mutation.gene + " " + mutation.shortMutation)

          resolved = resolve(doc)
          resolved.url = "/genes/" + name
          result = new Object
          result["data"] = resolved

          mutations = new Object
          mutations["data"] = commonMutations

          result["data"]["sections"]["mutations"] = mutations

          callback db, err, result, res, 200
