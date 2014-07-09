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
    initializeResponse(res)
    knowledge.executeQuery err, db, req, res, responders.sendGetResponse(req, res)

app.get base + '/variants/:id',
  knowledge.connected config["data"]["knowledgedb"], (err, db, req, res) ->
    initializeResponse(res)
    knowledge.getVariant err, db, req, res, responders.sendGetResponse(req, res)

app.get base + '/publications/:type/:id',
  knowledge.connected config["data"]["knowledgedb"], (err, db, req, res) ->
    initializeResponse(res)
    knowledge.getPublication err, db, req, res, responders.sendGetResponse(req, res)

## PUT requests require authentication, and properly authorization too.
app.put base + '/variants/:id',
  knowledge.connected config["data"]["knowledgedb"], (err, db, req, res) ->
    initializeResponse(res)
    knowledge.putVariant err, db, req, res, responders.sendGetResponse(req, res)

## POST requests require authentication, and properly authorization too. This is
## not public, as it is primarily a service endpoint that can be used create a
## bunch of variants from, e.g., VCF file parsing. The POST system needs to be
## idempotent and accessible over web access.
app.post base + '/variants',
  knowledge.connected config["data"]["knowledgedb"], (err, db, req, res) ->
    initializeResponse(res)
    knowledge.postVariant err, db, req, res, responders.sendPostResponse(req, res)

app.get base + '/variants/:id/report',
  knowledge.connected config["data"]["knowledgedb"], (err, db, req, res) ->
    initializeResponse(res)
    if req.query && req.query["type"] == 'pdf'
      knowledge.getVariantReport err, db, req, res, (db, err, doc, res, statusCode) ->
        statusCode = 400 if statusCode == undefined

        if err
          res.header('Content-Type', 'application/json')
          return res.send statusCode, {error: err, body: doc}

        doc["data"]["serviceUrl"] = req.url
        doc["data"]["config"] = res.locals.config if res.locals.config?
        view = "index"
        res.render view, doc, (err, html) ->
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

app.get base + '/tumourTypes',
  knowledge.connected config["data"]["knowledgedb"], (err, db, req, res) ->
    initializeResponse(res)
    knowledge.geTumourTypes err, db, req, res, responders.sendGetResponse(req, res)

app.get base + '/queries/:query',
  knowledge.connected config["data"]["knowledgedb"], (err, db, req, res) ->
    initializeResponse(res)
    knowledge.executeQuery err, db, req, res, responders.sendGetResponse(req, res)

app.get base + '/search',
  knowledge.connected config["data"]["knowledgedb"], (err, db, req, res) ->
    initializeResponse(res)
    knowledge.executeSearch err, db, req, res, responders.sendGetResponse(req, res)

app.get base + '/*', (req, res) ->
  res.send(404)
