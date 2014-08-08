## Knowledge service implementation. Nothing much to see here, move along please.

module.exports.log4js = module.parent.exports.log4js
module.exports.logger = module.parent.exports.logger
module.exports.config = module.parent.exports.config

app =    module.parent.exports.app
config = module.parent.exports.config
base =   config["heliotrope"]["knowledgeUriBase"]
logger = module.exports.logger

temp =            require('temp')
fs =              require("fs")

mongo =           require("mongodb")
MongoClient =     mongo.MongoClient
BSON =            mongo.BSONPure

## Knowledge service implementation. Nothing much to see here, move along please.
reporting =       require("./reporting")
responders =      require("./responders")
authentication =  require("./authentication")
knowledge =       require("./knowledgeImplementation")

knowledge.initialize()

logger.info("Initializing knowledge base at: " + base)

knowledgeMiddleware = (req, res, next) =>

  ## Allow bypass on content negotiation when the mimeType query parameter is set
  if req.query.mimeType?
    req.headers.accept = req.query.mimeType
    delete req.query.mimeType

  originalEnd = res.end
  res.end = (chunk, encoding) ->
    res.end = originalEnd
    res.end(chunk, encoding)
    if res.locals.db?
      res.locals.db.close()

  res.locals.config = config["heliotrope"]
  res.locals.uriBase = base

  MongoClient.connect config["data"]["knowledgedb"], (err, db) ->
    return next(err) if err?
    res.locals.db  = db
    next()

app.get base + '/genes/:gene', knowledgeMiddleware, knowledge.getGene

app.get base + '/genes/:gene/mutations', knowledgeMiddleware, knowledge.getGeneMutations

app.get base + '/genes/:gene/frequencies', knowledgeMiddleware, knowledge.getGeneFrequencies

app.get base + '/queries/:query', knowledgeMiddleware, knowledge.executeQuery

app.get base + '/variants/:id', knowledgeMiddleware, knowledge.getVariant

app.get base + '/variants/:id/frequencies', knowledgeMiddleware, knowledge.getVariantFrequencies

app.get base + '/publications/:type/:id',
  knowledge.connected config["data"]["knowledgedb"], (err, db, req, res) ->
    initializeResponse(res)
    knowledge.getPublication err, db, req, res, responders.sendGetResponse(req, res)

## PUT requests require authentication, and properly authorization too.
app.put base + '/variants/:id', authentication.accessAuthenticator(), knowledgeMiddleware,  knowledge.putVariant

## POST requests require authentication, and properly authorization too. This is
## not public, as it is primarily a service endpoint that can be used create a
## bunch of variants from, e.g., VCF file parsing. The POST system needs to be
## idempotent and accessible over web access.
app.post base + '/variants', authentication.apiAuthenticator(),
  knowledge.connected config["data"]["knowledgedb"], (err, db, req, res) ->
    initializeResponse(res)
    knowledge.postVariant err, db, req, res, responders.sendPostResponse(req, res)

app.get base + '/variants/:id/report', knowledgeMiddleware, knowledge.getVariantReport

app.get base + '/search', knowledgeMiddleware, knowledge.executeSearch

app.get base + '/*', (req, res) ->
  res.send(404)
