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

## Service endpoint for a list of studies. This is generally not authenticated, and
## should return a more public list of apparent information. Actually, it might well
## be authenticated a bit at some stage, but not now.
app.get base + '/studies',
  tracker.connected config["data"]["trackerdb"], (err, db, req, res) ->
    initializeResponse res
    tracker.getStudies err, db, req, res, responders.sendGetResponse(req, res)

## Service endpoint for creating a new study. This will require editorial/admin
## authorization.
app.post base + '/studies',
  tracker.connected config["data"]["trackerdb"], (err, db, req, res) ->
    initializeResponse res
    tracker.postStudies err, db, req, res, responders.sendPostResponse(req, res)

