module.exports.log4js = module.parent.exports.log4js
module.exports.logger = module.parent.exports.logger

mongo =           require("mongodb")
MongoClient =     mongo.MongoClient
BSON =            mongo.BSONPure

genomics =        require("./genomics")

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

getVariantSelector = (req) ->
  id = req.params.id.replace(/\+/, " ")
  components = id.split(" ")

  if components.length >= 2
    name = components[0]
    mutation = components[1]
    mutation = genomics.convertNamesToCodes(mutation)
    mutation = "p." + mutation if ! mutation.substring("p.")
    {gene: name, shortMutation: mutation}
  else
    {_id: new BSON.ObjectID(id)}

findVariant = (err, db, variants, selector, res, callback) ->
  variants.find(selector).limit(1).toArray (err, docs) ->
    if err then return callback db, err, {}, res
    if docs.length < 1 then return callback db, {err: "no such object: " + selector.toString()}, "", res, 404
    doc = docs[0]

    resolved = resolve(doc)
    encodedName = encodeURIComponent(doc.shortName)
    encodedName = encodedName.replace(/%20/g, '+')
    resolved.url = "/variants/" + encodedName

    result = new Object
    result["data"] = resolved

    geneId = resolved["genesRefx"]["_id"].toHexString()
    db.collection "genes", (err, genes) ->
      genes.find({_id: new BSON.ObjectID(geneId)}).limit(1).toArray (err, geneDocs) ->
        if err then return callback db, err, {}, res
        if geneDocs.length < 1 then return callback db, {err: "no such gene: " + geneId}, "", res, 404

        result["data"]["sections"]["distribution"] = geneDocs[0]["sections"]["distribution"]
        result["data"]["sections"]["transcripts"] = geneDocs[0]["sections"]["transcripts"]
        callback db, err, result, res, 200

## Retrieves a variant. The endpoint also looks up a little gene information and implants
## that into the response where appropriate.
## @param req
## @param callback
getVariant = (err, db, req, res, callback) ->
  selector = getVariantSelector(req)

  db.collection "variants", (err, variants) ->
    findVariant err, db, variants, selector, res, callback

module.exports.getVariant = getVariant

## Retrieves a variant report. The endpoint also looks up a little gene information and implants
## that into the response where appropriate.
## @param req
## @param callback
module.exports.getVariantReport = (err, db, req, res, callback) ->
  getVariant err, db, req, res, (db, err, result, res) ->
    geneId = result["data"]["genesRefx"]["_id"]
    db.collection "genes", (err, genes) ->
      genes.find({_id: geneId}).limit(1).toArray (err, geneDocs) ->
        if err then return callback db, err, {}, res
        if geneDocs.length < 1 then return callback db, {err: "no such gene: " + geneId}, "", res, 404
        result["data"]["genesRefx"]["_body"] = resolve(geneDocs[0])
        result["data"]["chart"] = knowledgeCharts.getVariantChartSVG(result)
        callback db, err, result, res, 200

## Handler for the search API. This accepts a single string and returns a set of
## hits. The principle is fairly simple, we want to look to see if there is a
## space in the string, and if so, we behave a little differently. Each returned
## result is tagged for display using some kind of a directive.
##
## @param req
## @param callback
module.exports.executeSearch = (err, db, req, res, callback) ->
  query = req.query.q
  result = new Object
  response = new Object

  response["query"] = query
  response["results"] = []
  result["data"] = response

  addGeneResults = (db, query, result, callback) ->
    db.collection "genes", (err, genes)->
      components = query.split(" ")
      if components.length >= 1
        name = components[0].toUpperCase()
        genes.find({name: name}).limit(1).toArray (err, docs) ->
          if docs.length < 1
            callback db, query, result
          else
            doc = docs[0]
            hit = new Object
            hit["type"] = "gene"
            hit["url"] = "/genes/" + doc["name"]
            hit["name"] = doc["name"]
            hit["label"] = hit["name"]
            result["data"]["results"].push(hit)
            callback db, query, result
      else
        callback db, query, result

  addVariantResults = (db, query, result, callback) ->
    db.collection "variants", (err, variants) ->
      components = query.split(" ")
      if components.length >= 2
        name = components[0]
        mutation = components[1]
        mutation = genomics.convertNamesToCodes(mutation)
        mutation = "p." + mutation if ! mutation.startsWith("p.")

        variants.find({gene: name, shortMutation: mutation}).limit(1).toArray (err, docs) ->
          if docs.length < 1
            callback db, query, result
          else
            doc = docs[0]
            hit = new Object
            hit["type"] = "mutation"
            hit["url"] = "/variants/" + encodeURIComponent(doc["shortName"])
            hit["gene"] = doc["gene"]
            hit["mutation"] = doc["mutation"]
            hit["shortMutation"] = doc["shortMutation"]
            hit["label"] = hit["gene"] + " " + hit["shortMutation"] + " (" + hit["mutation"] + ")"
            result["data"]["results"].push(hit)
            callback db, query, result
      else
        callback db, query, result

  query = query.trim()
  addGeneResults db, query, result, (db, query, result) ->
    addVariantResults db, query, result, (db, query, result) ->
      callback db, err, result, res, 200

module.exports.getPublication = (err, db, req, res, callback) ->
  type = req.params['type']
  id = req.params['id']
  publicationId = type + ":" + id
  db.collection "publications", (err, publications) ->
    if err then return callback db, err, {}, res

    publications.find({name: publicationId}).limit(1).toArray (err, docs) ->
      if err then return callback db, err, {}, res
      if docs.length < 1 then return callback db, {err: "no such object: " + publicationId}, "", res, 404
      doc = docs[0]

      result = new Object
      result["data"] = doc
      callback db, err, result, res, 200

## Updates/creates a variant. This is used to store new variants created from VCF files.
## There is a significant amount of basic data needed for a single variant. Each must include, at
## a minimum, the fields below. All of these can be derived from a properly managed use of the
## Ensembl variant effect predictor. The fields are validated fairly thoroughly in terms of their
## existence, but no semantic checking or consistency checks are applied.
## <p>
## <ul>
## <li>variantType - the variant type, always "mutation"
## <li>shortMutation - e.g., "p.D1208Y" (optional)
## <li>consequence - e.g., "missense_variant"
## <li>name - e.g., "NPHS1 p.Asp1208Tyr" (optional)
## <li>gene - e.g, "NPHS1"
## <li>geneId - e.g., "ENSG00000161270
## <li>mutation - e.g., "p.Asp1208Tyr"
## <li>type - e.g., "variant"
## <li>shortName - e.g., "NPHS1 p.D1208Y" (optional)
## </ul>
## <p>
## All remaining data for a variant is pushed into the first positions record. It will typically
## contain at least the following fields. Note that the database stores more information, and
## will typically complete it from the core data included above. Some of these are required.
## The core issue is how we RESTfully sensibly allow multiple items to be created.
## <p>
## <ul>
## <li>sift - e.g., { "level" : "tolerated", "score" : 0.07 } (optional)
## <li>polyphen - e.g., { "level" : "benign", "score" : 0.002 } (optional)
## <li>stop - e.g., "36317520"
## <li>HGVSc - e.g., "c.3622G>T"
## <li>cdsPosition - e.g., "3622"
## <li>HGVSp - e.g., "p.Asp1208Tyr" (optional)
## <li>codon - e.g., "1208"
## <li>transcript - e.g., "ENST00000378910"
## <li>HGVSpr - e.g., "p.D1208Y" (optional)
## <li>chromosome - e.g., "19"
## <li>exon - e.g., "29"
## <li>start - e.g., "36317520"
## </ul>
##
## @param err error flag from the database connection
## @param db the database connection
## @param req the request
## @param res the response
## @param callback

module.exports.postVariant = (err, db, req, res, callback) ->
  body = req.body
  data = req.body.data
  errors = []

  requiredFields = ["consequence", "type", "gene", "geneId", "mutation", "transcript", "start", "stop"]
  integerFields =  ["start", "stop", "exon", "codon", "cdsPosition"]
  primaryFields =  ["variantType", "shortMutation", "consequence", "name", "gene", "geneId", "mutation", "type", "shortName"]

  ## Now we can do some basic validation.
  validateRequiredField = (field) ->
    errors.push("Missing field: " + field) if ! data[field]?

  validateIntegerField = (field) ->
    value = data[field]
    if typeof value == 'string'
      parsed = parseInt(value)
      if parsed == NaN
        errors.push("Invalid value for field: " + field + " (value: " + value.toString() + ")")
      else
        data[field] = parsed
    else if value && typeof value != 'number'
      errors.push("Invalid value for field: " + field + " (value: " + value.toString() + ")")

  requiredFields.forEach(validateRequiredField)
  integerFields.forEach(validateIntegerField)

  if errors.length > 0
    return callback db, {error: errors.join(", ")}, {}, res, 400

  # Complete inferred values

  data["shortMutation"] = genomics.convertNamesToCodes(data["mutation"]) if !data["shortMutation"]
  data["name"] =          data["gene"] + " " + data["mutation"] if !data["name"]
  data["shortName"] =     data["gene"] + " " + data["shortMutation"] if !data["shortName"]

  # And finally, we want to restructure this into a statement that we can use to do a safe insert. Do this using a
  # standard MongoDB insert, which ought to get rejected if we have an existing variant with that name. This is a
  # key requirement. We have a unique and safe index on the name field for the variants collection, which ought to be
  # enough. That index is ensured below.

  record = {}
  for field in primaryFields
    record[field] = data[field]
    delete data[field]
  record["sections"] = {}
  record["sections"]["positions"] = {}
  record["sections"]["positions"]["data"] = []
  position = {}
  record["sections"]["positions"]["data"].push(position)

  for own field of data
    position[field] = data[field]

  record["version"] = 1

  assert(record["name"], "Internal error: missing name")

  # Finally, we need to make the reference to the gene. Best way to do this is to use the Ensembl gene identifier.
  # Now we're into MongoDB territory.

  geneSelector = {id: record["geneId"]}
  db.collection "genes", (err, genes) ->
    genes.find(geneSelector).limit(1).toArray (err, docs) ->
      if err || docs.length == 0 then return callback db, {error: "Failed to find gene: " + record["geneId"]}, {}, res, 400

      record["genesRidx"] = 0
      record["references"] = [{
        "_id" : docs[0]._id,
        "ref" : "genes",
        "name" : docs[0].name
      }]

      insertOptions = {"fsync" : true, "w" : 1};
      db.collection "variants", (err, variants) ->
        variants.insert record, insertOptions, (err, result) ->
          if err
            callback db, {error: err}, {}, res, (if err.code == 11000 then 403 else 400)
          else
            url = "/variants/" + encodeURIComponent(record["shortName"])
            callback db, null, url, res

## Updates a variant. This is used to save updates from the front end.
## @param req
## @param callback

module.exports.putVariant = (err, db, req, res, callback) ->
  selector = getVariantSelector(req)
  body = req.body

  db.collection "variants", (err, variants) ->

    # We don't need to update everything, but we should replace certain sections, and primarily
    # everything clinical, since that's typically been annotated. We could be sloppy and just replace
    # the whole darned thing, but that's possibly risky if someone messes about with the client
    # data somehow.
    update = {}
    update["$set"] = {}
    update["$set"]["sections.clinical.data.action"] = body.data.sections.clinical.data.action
    update["$set"]["sections.clinical.data.agents"] = body.data.sections.clinical.data.agents
    update["$set"]["sections.clinical.data.significance"] = body.data.sections.clinical.data.significance

    update["$push"] = {}
    update["$push"]["sections.clinical.data.history"] = {
      "modifiedDate" : new Date(),
      "modifiedBy" : req.user || "anonymous"
    }

    variants.update selector, update, {upsert:false, multi: false, w: 1}, (err, result) ->
      if err
        callback db, err, {}
      else if result != 1
        callback db, {err: "Internal error: failed to update: " + selector.toString()}, {}
      else
        findVariant err, db, variants, selector, res, callback