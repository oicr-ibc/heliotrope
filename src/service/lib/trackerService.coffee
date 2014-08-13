log4js = require('log4js')
logger = log4js.getLogger('trackerService')

app = require('./application')
config = app.locals.config
base =   config["heliotrope"]["trackerUriBase"]

MongoClient =     require("mongodb").MongoClient

## Knowledge service implementation. Nothing much to see here, move along please.
tracker =         require("./trackerImplementation")
authentication =  require("./authentication")

tracker.initialize()

logger.info "Initializing tracker at: " + base

router = require('express').Router()

## Add middleware to open a database connection, and clean up afterwards
router.use (req, res, next) =>
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

  MongoClient.connect config['data']['tracker']['store']['url'], (err, db) ->
    return next(err) if err?
    res.locals.db  = db
    next()

## Service endpoint for a list of studies. This is generally not authenticated, and
## should return a more public list of apparent information. Actually, it might well
## be authenticated a bit at some stage, but not now.
router.get '/studies', tracker.getStudies

## Service endpoint for creating a new study. This will require editorial/admin
## authorization.
router.post '/studies', tracker.postStudies

## Service endpoint for a single study. This is authenticated, and returns information
## about that study.
router.get '/studies/:study', authentication.accessAuthenticator(), tracker.getStudy

## Service endpoint for a single study step. This is authenticated, and returns information
## about that study.
# router.get '/steps/:study/:role/:step', authentication.accessAuthenticator(), tracker.getStudyStep

## Service endpoint for a single entity. This is authenticated, and returns information
## about that that entity, identified by role and identity string.
router.get '/studies/:study/:role/:identity', authentication.accessAuthenticator(), tracker.getEntity

## Service endpoint for a single entity step. This is authenticated, and returns information
## about that the step for that entity, identified by role and identity string, and by step
## name (possibly with an identifier).
router.get '/studies/:study/:role/:identity/step/:step', authentication.accessAuthenticator(), tracker.getEntityStep

## Service endpoint for a set of entities related to a single entity. This is authenticated, and returns information
## about that the entity identified by role and identity string.
# router.get '/related/:study', authentication.accessAuthenticator(), tracker.getStudyRelatedEntities

## Service endpoint for a set of entities within a study with a given role.
# router.get '/studies/:study/:role', authentication.accessAuthenticator(), tracker.getEntities

## Service endpoint for a set of views within a study for entities without any role specified.
# router.get '/views/:study', authentication.accessAuthenticator(), tracker.getViews

## Service endpoint for a set of views within a study for entities with a given role.
router.get '/views/:study/:role', authentication.accessAuthenticator(), tracker.getViews

## Service endpoint for a set of views within a study for entities with a given role.
# router.get '/views/:study/:role/:view', authentication.accessAuthenticator(), tracker.getView

## Service endpoint to update a given step for a given entity, identified
## by role, entity identifier, and step name.
router.post '/studies/:study/:role/:identity/step/:step', authentication.accessAuthenticator(), tracker.postEntityStep

## Service endpoint to push files for a given step for a given entity, identified
## by role, entity identifier, and step name. Files are handled in a separate
## request (that's just the way single-page apps have to do it).
# router.post '/studies/:study/:role/:identity/step/:step/files', authentication.accessAuthenticator(), tracker.postEntityStepFiles

## Administration endpoints, primarily for editing. These require administrative access.

## Service endpoint to update a step definition.
# router.post '/steps/:study', authentication.accessAuthenticator({role: "TRACKER_ADMIN"}), tracker.postStudyStep

## Service endpoint to update a step definition, specified differently.
# router.post '/steps/:study/:role/:step', authentication.accessAuthenticator({role: "TRACKER_ADMIN"}), tracker.postStudyStep

## Service endpoint to update a view definition.
# router.post '/views/:study', authentication.accessAuthenticator({role: "TRACKER_ADMIN"}), tracker.postStudyView

## Service endpoint to update a view definition, specified differently.
# router.post '/views/:study/:role/:view', authentication.accessAuthenticator({role: "TRACKER_ADMIN"}), tracker.postStudyView

# router.get '/*', (req, res) -> res.status(404).send()

module.exports = router
