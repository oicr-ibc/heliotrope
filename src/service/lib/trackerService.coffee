module.exports.log4js = module.parent.exports.log4js
module.exports.logger = module.parent.exports.logger

app =    module.parent.exports.app
config = module.parent.exports.config
base =   config["heliotrope"]["trackerUriBase"]

## Knowledge service implementation. Nothing much to see here, move along please.
responders = require("./responders")
tracker =    require("./trackerImplementation")

tracker.initialize()

initializeResponse = (res) ->
  res.locals.config = config["heliotrope"]
  res.locals.uriBase = base

## Define the endpoints
app.get base + '/studies',
  tracker.connected config["data"]["trackerdb"], (err, db, req, res) ->
    initializeResponse(res)
    tracker.getStudies(err, db, req, res, responders.sendGetResponse(req, res))
