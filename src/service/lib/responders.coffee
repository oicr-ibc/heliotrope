## Heliotrope responders -- shared by tracker and knowledge base

module.exports.sendViewResponse = (req, res, view) ->
  (db, err, doc, res, statusCode) ->
    statusCode = 400 if ! statusCode?
    if err
      res.header 'Content-Type', 'application/json'
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
      res.send statusCode, {error: err, url: url}
    else
      res.redirect res.locals.uriBase + url
    db.close()
