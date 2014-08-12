module.exports.log4js = module.parent.exports.log4js
module.exports.logger = module.parent.exports.logger
module.exports.config = module.parent.exports.config

config = module.exports.config
logger = module.exports.logger

async =           require("async")
mongo =           require("mongodb")
jade =            require("jade")
fs =              require("fs")
temp =            require("temp")

MongoClient =     mongo.MongoClient
BSON =            mongo.BSONPure

genomics =        require("./genomics")
knowledgeCharts = require("./knowledgeCharts")
reporting =       require("./reporting")
ChartMaker =      require("./chartmaker")

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

relativeUrl = (string) ->
  config['heliotrope']['baseUrl'] + config['heliotrope']['knowledgeUriBase'] + string

## Database endpoint to read a single gene. This should also read a set of the
## related entities of all types.
## @param name - the name of the study
## @param callback - function

getGene = (req, res) ->
  name = req.params.gene
  db = res.locals.db
  db.collection "genes", (err, genes) ->
    return res.status(500).send(err) if (err)
    genes.findOne {name: name}, (err, doc) ->
      return res.status(500).send(err) if (err)
      return res.status(404).send({err: "no such object: " + name}) if ! doc?

      resolved = resolve(doc)
      resolved.url = relativeUrl("/genes/" + name)
      resolved.mutationsUrl = resolved.url + "/mutations"
      resolved.frequenciesUrl = resolved.url + "/frequencies"

      result = new Object
      result['data'] = resolved
      result['config'] = res.locals.config

      res.send(result)

module.exports.getGene = getGene

getGeneMutations = (req, res) ->
  name = req.params.gene
  db = res.locals.db
  db.collection "genes", (err, genes) ->
    return res.status(500).send(err) if (err)

    genes.findOne {name: name}, (err, doc) ->

      db.collection "variantRecords", (err, variantRecords) ->
        return res.status(500).send(err) if (err)

        pipeline = [
          { $match : {  geneId : doc["_id"], mutationName : { $ne : null }}},
          { $group : { _id : '$mutationName', frequency : { $sum : 1 }, codon : { $min : '$mutationCodon'}}},
          { $project : { _id : 0, name : '$_id', frequency : 1, codon : 1, variant: { $concat : [ name, '+', '$_id' ]}}},
          { $sort : { 'frequency' : -1 }}
        ]

        variantRecords.aggregate pipeline, (err, records) ->
          return res.status(500).send(err) if (err)

          result = {}
          result['data'] = records
          result['url'] = req.url
          res.send(result)

module.exports.getGeneMutations = getGeneMutations

module.exports.executeQuery = (req, res) ->
  name = req.params.query
  db = res.locals.db
  db.collection "statistics", (err, statistics) ->
    return res.status(500).send(err) if (err)

    statistics.findOne {'tag' : name}, (err, commonGenes) ->
      return res.status(500).send(err) if (err)
      result = new Object
      result['data'] = commonGenes.data
      result['config'] = res.locals.config
      res.send result


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


## Retrieves a variant. The endpoint also looks up a little gene information and implants
## that into the response where appropriate.
## @param req
## @param callback
getVariant = (req, res) ->

  getVariantData req, res, (err, doc) ->
    return res.status(err.code).send(err.err) if err?

    resolved = resolve(doc)
    encodedName = encodeURIComponent(doc.shortName)
    encodedName = encodedName.replace(/%20/g, '+')
    resolved.url = relativeUrl("/variants/" + encodedName)
    resolved.geneUrl = relativeUrl("/genes/" + resolved.gene)
    resolved.frequenciesUrl = resolved.url + "/frequencies"
    resolved.mutationsUrl = resolved.geneUrl + "/mutations"

    result = new Object
    result['data'] = resolved
    result['config'] = res.locals.config
    result['url'] = req.url

    res.send result

module.exports.getVariant = getVariant

getVariantData = (req, res, callback) ->
  selector = getVariantSelector(req)

  db = res.locals.db
  db.collection "variants", (err, variants) ->
    return callback {code: 500, error: err} if (err)

    variants.findOne selector, (err, doc) ->
      return callback {code: 500, error: err} if (err)
      return callback {code: 404, error: {err: "no such object: " + selector.toString()}} if (! doc?)

      callback null, doc

getVariantGene = (req, res) ->
  getVariantData req, res, (err, doc) ->
    return res.status(err.code).send(err.err) if err?

    req.params.gene = doc.gene
    getGene(req, res)

getVariantGeneMutations = (req, res) ->
  getVariantData req, res, (err, doc) ->
    return res.status(err.code).send(err.err) if err?

    req.params.gene = doc.gene
    getGeneMutations(req, res)

## Updates a variant. This is used to save updates from the front end.
##
## @param req
## @param callback

module.exports.putVariant = (req, res) ->
  selector = getVariantSelector(req)
  body = req.body

  db = res.locals.db
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
      return res.status(500).send(err) if (err)
      return res.status(500).send({err: "Internal error: failed to update: " + selector.toString()}) if (result != 1)
      getVariant req, res


## Retrieves a variant report. The endpoint also looks up a little gene information and implants
## that into the response where appropriate. This requires a different strategy than the other
## endpoints, in that we want to merge data from several endpoints into a single data block for
## rendering.
##
## @param req
## @param res
## @param callback

getVariantReportData = (req, res, callback) ->

  ## We are going to be a bit cunning here. We're going to mock a response for
  ## the various endpoints, and collate the data into a single object. When we are
  ## done, we combine and render.

  MockResponse = class
    constructor: (@responseCallback) ->
      @locals = {db: res.locals.db, config: res.locals.config}
    status: (code) -> @code = code
    send: (data) -> @responseCallback(@code != 200 and @code, data)

  requests = {
    'variant': module.exports.getVariant,
    'frequencies': module.exports.getVariantFrequencies
    'gene': getVariantGene
    'mutations': getVariantGeneMutations
  }

  result = {}

  requestHandler = (key, itemCallback) ->
    mocked = new MockResponse (err, data) ->
      # console.log "Received response", key, data
      result[key] = data if ! err?
      itemCallback(err)
    requests[key](req, mocked)

  resultHandler = (err) ->
    callback(err, result)

  async.each Object.keys(requests), requestHandler, resultHandler


respondWithPDF = (html, res) ->
  buffer = new Buffer(html)

  temp.open 'report', (err, info) ->
    console.error("Failed to open file", err) if err

    fs.write info.fd, buffer, 0, buffer.length, null, (err, written, buffer) ->
      console.error("Failed to open file", err) if err

      fs.close info.fd, (err) ->
        console.error("Failed to close file", err) if err

        reporting.generatePdf info.path, (err, stream) ->
          stream.pipe(res)


transformDomains = (domains) ->
  sortedDomains = domains.sort (a, b) -> a["start"] - b["start"]
  domainCount = sortedDomains.length
  d = 0

  while d < domainCount
    next = d + 1

    ## Simple case, no more domains. Stop.
    break if next == domainCount

    thisDomain = sortedDomains[d]
    nextDomain = sortedDomains[next]

    ## Simple case, next domain starts after this one, no overlap
    if thisDomain["end"] < nextDomain["start"]
      d++
      continue

    ## The domains do overlap. Keep the biggest. Note we splice the sortedDomains
    ## array and adjust count so we can continue.
    thisSize = thisDomain["end"] - thisDomain["start"]
    nextSize = nextDomain["end"] - nextDomain["start"]

    if thisSize >= nextSize

      ## Next is smaller, remove it.
      sortedDomains.splice(next, 1)
    else

      ## This is smaller. Juggle them
      sortedDomains.splice(d, 2, nextDomain)

    domainCount--
    continue

  ({id: domain["hitName"], start: domain["start"], stop: domain["end"], description: domain["description"]} for domain in sortedDomains)


getVariantChartSVG = (data) ->

  transcript = data.gene.data.sections.transcripts.data.records[0]

  positionString = data.variant.data.sections.positions.data[0]["codonStart"]
  position = parseInt((positionString).toString())

  mutationsData = for m in data.mutations.data when m.codon
    {id: m.name, position: m.codon , url: null, value: m.frequency, selected: (m.name == data.variant.data.mutation)}

  # Make sure selected markers are at the front. Don't use sort for this, no need. We can
  # filter and concatenate in two passes.
  mutationsSelected = mutationsData.filter (a) -> a.selected
  mutationsUnselected = mutationsData.filter (a) -> !a.selected

  domains = transcript["domains"].filter (domain) -> domain["gffSource"] == "Pfam"

  chartData =
    start: 1
    stop: transcript["lengthAminoAcid"]
    domains: transformDomains(domains)
    mutations: [].concat(mutationsUnselected, mutationsSelected)

  markerClassFn = (d) -> if d.selected then 'marker marker-selected' else 'marker marker-unselected'
  markerTooltipHtmlFn = (d) -> undefined

  chart = new ChartMaker({tooltips: false, displayWidth: 500, valueHeight: 80, markerClassFn: markerClassFn, markerTooltipHtmlFn: markerTooltipHtmlFn}, chartData)
  chart.display('body')

  chart.getChartElement().html()


module.exports.getVariantReport = (req, res) ->
  getVariantReportData req, res, (err, data) ->
    return res.status(500).send(err) if err?

    ## There are several parts to this. We always want at least HTML. We might
    ## then want to transform that HTML to PDF, or something similar.

    try
      data['chart'] = getVariantChartSVG(data)
    catch error
      console.error "Error", error
      return res.status(500).send(error)

    html = undefined
    try
      html = jade.renderFile 'etc/reporting/templates/report.jade', data
    catch error
      console.error "Error", error
      return res.status(500).send(error)

    console.log "Types", req.accepts(['application/pdf', 'text/html']), req.accepted

    res.format

      'application/pdf': () ->
        console.log "Sending", 'application/pdf'
        res.header('Content-Disposition', 'attachment; filename="report.pdf"')
        respondWithPDF html, res

      'text/html': () ->
        console.log "Sending", 'text/html'
        res.send html


module.exports.getPDFVariantReport = (req, res) ->
  if req.query && req.query["type"] == 'pdf'
    knowledge.getVariantReport err, db, req, res, (db, err, doc, res, statusCode) ->
      statusCode = 400 if statusCode == undefined

      if err
        res.header('Content-Type', 'application/json')
        return res.send statusCode, {error: err, body: doc}

      doc["data"]["serviceUrl"] = req.url
      doc["data"]["config"] = res.locals.config if res.locals.config?
      view = "index.jade"
      res.render view, doc, (err, html) ->
        if err
          db.close()
          res.send 500, err
        else
          buffer = new Buffer(html)

          temp.open 'report', (err, info) ->
            console.error("Failed to open file", err) if err

            fs.write info.fd, buffer, 0, buffer.length, null, (err, written, buffer) ->
              console.error("Failed to open file", err) if err

              fs.close info.fd, (err) ->
                console.error("Failed to close file", err) if err

                reporting.generatePdf info.path, (err, stream) ->

                  db.close()
                  res.header('Content-Type', 'application/pdf')
                  res.header('Content-Disposition', 'attachment; filename="report.pdf"')
                  stream.pipe(res)
  else
    knowledge.getVariantReport err, db, req, res, responders.sendViewResponse(req, res, 'index')


module.exports.getGeneFrequencies = (req, res) ->
  name = req.params.gene
  db = res.locals.db
  db.collection "genes", (err, genes) ->
    return res.status(500).send(err) if (err)

    genes.findOne {name: name}, (err, doc) ->

      return res.status(500).send(err) if (err)
      return res.status(404).send({err: "no such object: " + selector.toString()}) if (! doc?)

      variantFrequenciesPipeline = [
        { $match : {  geneId : doc['_id'] }},
        { $group : { _id : { site : '$primarySite', hist : '$primaryHist'}, total : { $sum : 1}, mutated : { $sum : {$cond : { if : {$ne : ['$mutationId', null]}, then : 1, else : 0 }}}}},
        { $project : { _id : 0, type : '$_id', total : 1, mutated : 1, frequency: { $divide : [ '$mutated', '$total']}}},
        { $match : { mutated : { $gt : 0}}},
        { $sort : { 'frequency' : -1 }}
      ]

      db.collection "variantRecords", (err, variantRecords) ->
        return res.status(500).send(err) if (err)
        variantRecords.aggregate variantFrequenciesPipeline, (err, variantFrequencies) ->
          return res.status(500).send(err) if (err)

          result = new Object
          result['data'] = variantFrequencies
          result['config'] = res.locals.config
          res.send result

## Retrieves variant frequencies.
## @param req
## @param req
module.exports.getVariantFrequencies = (req, res) ->
  selector = getVariantSelector(req)

  db = res.locals.db
  db.collection "variants", (err, variants) ->
    return res.status(500).send(err) if (err)

    variants.findOne selector, (err, doc) ->
      return res.status(500).send(err) if (err)
      return res.status(404).send({err: "no such object: " + selector.toString()}) if (! doc?)

      geneId = doc.references[doc.genesRidx]['_id']

      variantFrequenciesPipeline = [
        { $match : {  geneId : geneId}},
        { $group : { _id : { site : '$primarySite', hist : '$primaryHist'}, total : { $sum : 1}, mutated : { $sum : {$cond : { if : {$eq : ['$mutationId', doc['_id']]}, then : 1, else : 0 }}}}},
        { $project : { _id : 0, type : '$_id', total : 1, mutated : 1, frequency: { $divide : [ '$mutated', '$total']}}},
        { $match : { mutated : { $gt : 0}}},
        { $sort : { 'frequency' : -1 }}
      ]

      db.collection "variantRecords", (err, variantRecords) ->
        return res.status(500).send(err) if (err)
        variantRecords.aggregate variantFrequenciesPipeline, (err, variantFrequencies) ->
          return res.status(500).send(err) if (err)

          result = new Object
          result['data'] = variantFrequencies
          result['config'] = res.locals.config
          res.send result

## Handler for the search API. This accepts a single string and returns a set of
## hits. The principle is fairly simple, we want to look to see if there is a
## space in the string, and if so, we behave a little differently. Each returned
## result is tagged for display using some kind of a directive.
##
## @param req
## @param callback

convertWildcardToRegex = (string) ->
  escaped = string.replace /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"
  if escaped == string
    string
  else
    new RegExp("^" + escaped.replace(/\\\*/g, '.*').replace(/\\\?/g, '.'))

module.exports.executeSearch = (req, res) ->
  db = res.locals.db
  query = req.query.q
  result = new Object
  response = new Object

  response["query"] = query
  response["results"] = []
  result["data"] = response

  addGeneResults = (query, result, callback) ->
    db.collection "genes", (err, genes)->
      components = query.split(" ")
      if components.length >= 1
        name = convertWildcardToRegex(components[0].toUpperCase())
        genes.find({name: name}).limit(1).toArray (err, docs) ->
          if docs.length < 1
            callback query, result
          else
            doc = docs[0]
            hit = new Object
            hit["type"] = "gene"
            hit["url"] = "/genes/" + doc["name"]
            hit["name"] = doc["name"]
            hit["label"] = hit["name"]
            result["data"]["results"].push(hit)
            callback query, result
      else
        callback query, result

  addVariantResults = (query, result, callback) ->
    db.collection "variants", (err, variants) ->
      components = query.split(" ")
      if components.length >= 2
        name = convertWildcardToRegex(components[0])
        mutation = components[1]
        mutation = genomics.convertNamesToCodes(mutation)
        mutation = "p." + mutation if ! mutation.startsWith("p.")
        mutation = convertWildcardToRegex(mutation)

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
            callback query, result
      else
        callback query, result

  query = query.trim()
  addGeneResults query, result, (query, result) ->
    addVariantResults query, result, (query, result) ->
      res.send result

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

