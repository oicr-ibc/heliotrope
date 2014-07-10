module.exports.log4js = module.parent.exports.log4js
module.exports.logger = module.parent.exports.logger

app =    module.parent.exports.app
config = module.parent.exports.config
base =   config["heliotrope"]["trackerUriBase"]

## Knowledge service implementation. Nothing much to see here, move along please.
responders =      require("./responders")
tracker =         require("./trackerImplementation")
authentication =  require("./authentication")

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

## Service endpoint for a single study. This is authenticated, and returns information
## about that study.
app.get base + '/studies/:study', authentication.accessAuthenticator(),
  tracker.connected config["data"]["trackerdb"], (err, db, req, res) ->
    initializeResponse res
    tracker.getStudy err, db, req, res, responders.sendGetResponse(req, res)

## Service endpoint for a single study step. This is authenticated, and returns information
## about that study.
app.get base + '/steps/:study/:role/:step', authentication.accessAuthenticator(),
  tracker.connected config["data"]["trackerdb"], (err, db, req, res) ->
    initializeResponse res
    tracker.getStudyStep err, db, req, res, responders.sendGetResponse(req, res)

## Service endpoint for a single entity. This is authenticated, and returns information
## about that that entity, identified by role and identity string.
app.get base + '/studies/:study/:role/:identity', authentication.accessAuthenticator(),
  tracker.connected config["data"]["trackerdb"], (err, db, req, res) ->
    initializeResponse res
    tracker.getEntity err, db, req, res, responders.sendGetResponse(req, res)

## Service endpoint for a single entity step. This is authenticated, and returns information
## about that the step for that entity, identified by role and identity string, and by step
## name (possibly with an identifier).
app.get base + '/studies/:study/:role/:identity/step/:step', authentication.accessAuthenticator(),
  tracker.connected config["data"]["trackerdb"], (err, db, req, res) ->
    initializeResponse res
    tracker.getEntityStep err, db, req, res, responders.sendGetResponse(req, res)

## Service endpoint for a set of entities related to a single entity. This is authenticated, and returns information
## about that the entity identified by role and identity string.
app.get base + '/related/:study', authentication.accessAuthenticator(),
  tracker.connected config["data"]["trackerdb"], (err, db, req, res) ->
    initializeResponse res
    tracker.getStudyRelatedEntities err, db, req, res, responders.sendGetResponse(req, res)

## Service endpoint for a set of entities within a study with a given role.
app.get base + '/studies/:study/:role', authentication.accessAuthenticator(),
  tracker.connected config["data"]["trackerdb"], (err, db, req, res) ->
    initializeResponse res
    tracker.getEntities err, db, req, res, responders.sendGetResponse(req, res)

## Service endpoint for a set of views within a study for entities without any role specified.
app.get base + '/views/:study', authentication.accessAuthenticator(),
  tracker.connected config["data"]["trackerdb"], (err, db, req, res) ->
    initializeResponse res
    tracker.getViews err, db, req, res, responders.sendGetResponse(req, res)

## Service endpoint for a set of views within a study for entities with a given role.
app.get base + '/views/:study/:role', authentication.accessAuthenticator(),
  tracker.connected config["data"]["trackerdb"], (err, db, req, res) ->
    initializeResponse res
    tracker.getViews err, db, req, res, responders.sendGetResponse(req, res)

## Service endpoint for a set of views within a study for entities with a given role.
app.get base + '/views/:study/:role/:view', authentication.accessAuthenticator(),
  tracker.connected config["data"]["trackerdb"], (err, db, req, res) ->
    initializeResponse res
    tracker.getView err, db, req, res, responders.sendGetResponse(req, res)

## Service endpoint to update a given step for a given entity, identified
## by role, entity identifier, and step name.
app.post base + '/studies/:study/:role/:identity/step/:step', authentication.accessAuthenticator(),
  tracker.connected config["data"]["trackerdb"], (err, db, req, res) ->
    initializeResponse res
    tracker.postEntityStep err, db, req, res, responders.sendPostResponse(req, res)

## Service endpoint to push files for a given step for a given entity, identified
## by role, entity identifier, and step name. Files are handled in a separate
## request (that's just the way single-page apps have to do it).
app.post base + '/studies/:study/:role/:identity/step/:step/files', authentication.accessAuthenticator(),
  tracker.connected config["data"]["trackerdb"], (err, db, req, res) ->
    initializeResponse res
    tracker.postEntityStepFiles err, db, req, res, responders.sendGetResponse(req, res)

## Administration endpoints, primarily for editing. These require administrative access.

## Service endpoint to update a step definition.
app.post base + '/steps/:study', authentication.accessAuthenticator({role: "TRACKER_ADMIN"}),
  tracker.connected config["data"]["trackerdb"], (err, db, req, res) ->
    initializeResponse res
    tracker.postStudyStep err, db, req, res, responders.sendPostResponse(req, res)

## Service endpoint to update a step definition, specified differently.
app.post base + '/steps/:study/:role/:step', authentication.accessAuthenticator({role: "TRACKER_ADMIN"}),
  tracker.connected config["data"]["trackerdb"], (err, db, req, res) ->
    initializeResponse res
    tracker.postStudyStep err, db, req, res, responders.sendPostResponse(req, res)

## Service endpoint to update a view definition.
app.post base + '/views/:study', authentication.accessAuthenticator({role: "TRACKER_ADMIN"}),
  tracker.connected config["data"]["trackerdb"], (err, db, req, res) ->
    initializeResponse res
    tracker.postStudyView err, db, req, res, responders.sendPostResponse(req, res)

## Service endpoint to update a view definition, specified differently.
app.post base + '/views/:study/:role/:view', authentication.accessAuthenticator({role: "TRACKER_ADMIN"}),
  tracker.connected config["data"]["trackerdb"], (err, db, req, res) ->
    initializeResponse res
    tracker.postStudyView err, db, req, res, responders.sendPostResponse(req, res)

app.get base + '/*', (req, res) ->
  res.send(404)
