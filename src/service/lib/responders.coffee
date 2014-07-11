## Heliotrope responders -- shared by tracker and knowledge base

module.exports.log4js = module.parent.exports.log4js
module.exports.logger = module.parent.exports.logger
module.exports.config = module.parent.exports.config

logger = module.exports.logger

module.exports.sendViewResponse = (req, res, view) ->
  (db, err, doc, res, statusCode) ->
    statusCode = 400 if ! statusCode?
    if err
      res.header 'Content-Type', 'application/json'
      logger.error "Error body", err
      res.send statusCode, {error: err, body: doc}
    else
      doc["data"]["serviceUrl"] = req.url
      doc["data"]["config"] = res.locals.config if res.locals.config?
      res.render view, doc
    db.close()

module.exports.sendGetResponse = (req, res) ->
  (db, err, doc, res, statusCode) ->
    statusCode = 400 if ! statusCode?
    if err
      res.header 'Content-Type', 'application/json'
      logger.error "Error body", err
      res.send statusCode, {error: err, body: doc}
    else
      res.header 'Content-Type', 'application/json'
      doc["data"]["serviceUrl"] = req.url
      doc["data"]["config"] = res.locals.config if res.locals.config?
      res.send statusCode, doc
    db.close()

module.exports.sendPostResponse = (req, res) ->
  (db, err, url, res, statusCode) ->
    statusCode = 404 if ! statusCode?
    if err
      logger.error "Error body", err
      res.send statusCode, {error: err, url: url}
    else
      res.redirect res.locals.uriBase + url
    db.close()
