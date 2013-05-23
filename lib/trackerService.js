// Knowledge service implementation. Nothing much to see here, move along please.

var app = module.parent.exports.app,
    config = module.parent.exports.config,
    base = config["heliotrope"]["trackerUriBase"];

var tracker = require("./trackerImplementation");

tracker.initialize();

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
      res.send(doc);
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

app.get(base + '/studies/:study', 
  tracker.connected(function(err, db, req, res) {
    initializeResponse(res);
    tracker.getStudy(err, db, req, res, sendGetResponse(req, res));
  })
);

app.get(base + '/studies/:study/:role/:identity',
  tracker.connected(function(err, db, req, res) {
    initializeResponse(res);
    tracker.getEntity(err, db, req, res, sendGetResponse(req, res));
  })
);

app.get(base + '/studies/:study/:role/:identity/step/:step',
  tracker.connected(function(err, db, req, res) {
    initializeResponse(res);
    tracker.getEntityStep(err, db, req, res, sendGetResponse(req, res));
  })
);

app.get(base + '/studies/:study/:role/:identity/related',
  tracker.connected(function(err, db, req, res) {
    initializeResponse(res);
    tracker.getRelatedEntities(err, db, req, res, sendGetResponse(req, res));
  })
);

app.get(base + '/studies/:study/:role',
  tracker.connected(function(err, db, req, res) {
    initializeResponse(res);
    tracker.getEntities(err, db, req, res, sendGetResponse(req, res));
  })
);

app.get(base + '/views/:study/:role', 
  tracker.connected(function(err, db, req, res) {
    initializeResponse(res);
    tracker.getViews(err, db, req, res, sendGetResponse(req, res));
  })
);

// Post responses are handled differently. We don't really want to return a 
// body, we want to redirect, a la PRG pattern http://www.theserverside.com/news/1365146/Redirect-After-Post
app.post(base + '/studies/:study/:role/:identity/step/:step', 
  tracker.connected(function(err, db, req, res) {
    initializeResponse(res);
    tracker.postEntityStep(err, db, req, res, sendPostResponse(req, res));
  })
);

// Mocking 
app.post(base + '/studies/:study/:role/:identity/step/:step/files', 
  tracker.connected(function(err, db, req, res) {
    initializeResponse(res);
    tracker.postEntityStepFiles(err, db, req, res, sendGetResponse(req, res));
  })
);

app.get(base + '/*', function(req, res) {
  res.send(404);
});

