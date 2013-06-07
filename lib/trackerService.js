// Knowledge service implementation. Nothing much to see here, move along please.

var app = module.parent.exports.app,
    config = module.parent.exports.config,
    base = config["heliotrope"]["trackerUriBase"],
    authentication = require("./authentication");

//var authenticate = app.locals.authenticate;
// var authenticate = authentication.authenticator();

// Almost all tracker service endpoints require authentication. At least, that's the 
// current model. 

var tracker = require("./trackerImplementation");
tracker.initialize();

/*
 * General purpose function to initialize a response. That can set locals which
 * are accessible through the rest of the request cycle. 
 */
function initializeResponse(res) {
  res.locals.config = config["heliotrope"];
}

/*
 * General purpose function to render a view using jade and a 
 * returned response. This is handy for some subrequests, where
 * it's important to send back something more like HTML.
 */
function sendViewResponse(req, res, view) {
  return function(db, err, doc, res, statusCode) {
    if (statusCode === undefined) {
      statusCode = 400;
    }
    if(err) {
      res.header('Content-Type', 'application/json');
      res.send(statusCode, {error: err, body: doc});
    } else {
      doc["data"]["serviceUrl"] = req.url
      if (res.locals.config) {
        doc["data"]["config"] = res.locals.config;
      }
      res.render(view, doc);
    }
    db.close();
  };
}

/**
 * General purpose function to send a document if one exists. 
 * The status code defaults to 400, but other values are allowed. 
 * @param res - the response
 * @returns {Function} - with (db, err, doc, statusCode) parameters
 */
function sendGetResponse(req, res) {
  return function(db, err, doc, res, statusCode) {
    if (statusCode === undefined) {
      statusCode = 400;
    }
    if(err) {
      res.header('Content-Type', 'application/json');
      res.send(statusCode, {error: err, body: doc});
    } else {
      res.header('Content-Type', 'application/json');
      doc["data"]["serviceUrl"] = req.url
      if (res.locals.config) {
        doc["data"]["config"] = res.locals.config;
      }
      res.send(statusCode, doc);
    }
    db.close();
  };
}

/**
 * General purpose function to send a url redirect if one exists.
 * The status code defaults to 404, but other values are allowed. 
 * @param res - the response
 * @returns {Function} - with (db, err, doc) parameters
 */
function sendPostResponse(req, res) {
  return function(db, err, url, res, statusCode) {
    if (statusCode === undefined) {
      statusCode = 404;
    }
    if(err) {
      res.send(statusCode, {error: err, url: url});
    } else {
      res.redirect(res.locals.config["trackerUriBase"] + url);
    }
    db.close();
  };
}

/**
 * Service endpoint for a list of studies. This is generally not authenticated, and
 * should return a more public list of apparent information. Actually, it might well
 * be authenticated a bit at some stage, but not now. 
 */
app.get(base + '/studies', 
  tracker.connected(function(err, db, req, res) {
    initializeResponse(res);
    tracker.getStudies(err, db, req, res, sendGetResponse(req, res));
  })
)

/**
 * Service endpoint for a single study. This is authenticated, and returns information
 * about that study. 
 */
app.get(base + '/studies/:study', authentication.accessAuthenticator(), 
  tracker.connected(function(err, db, req, res) {
    initializeResponse(res);
    tracker.getStudy(err, db, req, res, sendGetResponse(req, res));
  })
);

/**
 * Service endpoint for a single entity. This is authenticated, and returns information
 * about that that entity, identified by role and identity string. 
 */
app.get(base + '/studies/:study/:role/:identity', authentication.accessAuthenticator(), 
  tracker.connected(function(err, db, req, res) {
    initializeResponse(res);
    tracker.getEntity(err, db, req, res, sendGetResponse(req, res));
  })
);

/**
 * Service endpoint for a single entity step. This is authenticated, and returns information
 * about that the step for that entity, identified by role and identity string, and by step 
 * name (possibly with an identifier). 
 */
app.get(base + '/studies/:study/:role/:identity/step/:step', authentication.accessAuthenticator(), 
  tracker.connected(function(err, db, req, res) {
    initializeResponse(res);
    tracker.getEntityStep(err, db, req, res, sendGetResponse(req, res));
  })
);

/**
 * Service endpoint for a set of entities related to a single entity. This is authenticated, and returns information
 * about that the entity identified by role and identity string. 
 */
app.get(base + '/studies/:study/:role/:identity/related', authentication.accessAuthenticator(), 
  tracker.connected(function(err, db, req, res) {
    initializeResponse(res);
    tracker.getRelatedEntities(err, db, req, res, sendGetResponse(req, res));
  })
);

/**
 * Service endpoint for a set of entities within a study with a given role. 
 */
app.get(base + '/studies/:study/:role', authentication.accessAuthenticator(), 
  tracker.connected(function(err, db, req, res) {
    initializeResponse(res);
    tracker.getEntities(err, db, req, res, sendGetResponse(req, res));
  })
);

/**
 * Service endpoint for a set of views within a study for entities with a given role. 
 */
app.get(base + '/views/:study/:role', authentication.accessAuthenticator(), 
  tracker.connected(function(err, db, req, res) {
    initializeResponse(res);
    tracker.getViews(err, db, req, res, sendGetResponse(req, res));
  })
);

// Post responses are handled differently. We don't really want to return a 
// body, we want to redirect, a la PRG pattern http://www.theserverside.com/news/1365146/Redirect-After-Post

/**
 * Service endpoint to update a given step for a given entity, identified
 * by role, entity identifier, and step name. 
 */
app.post(base + '/studies/:study/:role/:identity/step/:step', authentication.accessAuthenticator(), 
  tracker.connected(function(err, db, req, res) {
    initializeResponse(res);
    tracker.postEntityStep(err, db, req, res, sendPostResponse(req, res));
  })
);

/**
 * Service endpoint to push files for a given step for a given entity, identified
 * by role, entity identifier, and step name. Files are handled in a separate 
 * request (that's just the way single-page apps have to do it).
 */
app.post(base + '/studies/:study/:role/:identity/step/:step/files', authentication.accessAuthenticator(), 
  tracker.connected(function(err, db, req, res) {
    initializeResponse(res);
    tracker.postEntityStepFiles(err, db, req, res, sendGetResponse(req, res));
  })
);

/**
 * Service endpoint for everything else, which just gets refused. Authentication isn't relevant. 
 */
app.get(base + '/*', function(req, res) {
  res.send(404);
});

