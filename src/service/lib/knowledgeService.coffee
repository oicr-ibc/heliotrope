## Knowledge service implementation. Nothing much to see here, move along please.

module.exports.log4js = module.parent.exports.log4js
module.exports.logger = module.parent.exports.logger

app =    module.parent.exports.app
config = module.parent.exports.config
base =   config["heliotrope"]["knowledgeUriBase"]
logger = module.exports.logger

## Knowledge service implementation. Nothing much to see here, move along please.
responders =   require("./responders")
knowledge =    require("./knowledgeImplementation")

knowledge.initialize()

logger.info("Initializing knowledge base at: " + base)

initializeResponse = (res) ->
  res.locals.config = config["heliotrope"]
  res.locals.uriBase = base

app.get base + '/genes/:gene',
  knowledge.connected config["data"]["knowledgedb"], (err, db, req, res) ->
    initializeResponse(res)
    knowledge.getGene err, db, req, res, responders.sendGetResponse(req, res)

app.get base + '/queries/:query',
  knowledge.connected config["data"]["knowledgedb"], (err, db, req, res) ->
    initializeResponse(res);
    knowledge.executeQuery err, db, req, res, responders.sendGetResponse(req, res)

app.get base + '/variants/:id',
  knowledge.connected config["data"]["knowledgedb"], (err, db, req, res) ->
    initializeResponse(res);
    knowledge.getVariant err, db, req, res, responders.sendGetResponse(req, res)
