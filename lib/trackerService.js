// Knowledge service implementation. Nothing much to see here, move along please.

var app = module.parent.exports.app,
    config = module.parent.exports.config;

var tracker = require("./trackerImplementation");

tracker.initialize();

/*
 * General purpose function to render a view using jade and a 
 * returned response. This is handy for some subrequests, where
 * it's important to send back something more like HTML.
 */
function sendViewResponse(req, res, view) {
  return function(db, err, doc, statusCode) {
    if (statusCode === undefined) {
      statusCode = 400;
    }
    if(err) {
      res.header('Content-Type', 'application/json');
      res.send(statusCode, {error: err, body: doc});
    } else {
      doc["data"]["serviceUrl"] = req.url
      if (res.locals.serviceBase) {
        doc["data"]["serviceBase"] = res.locals.serviceBase;
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
  return function(db, err, doc, statusCode) {
    if (statusCode === undefined) {
      statusCode = 400;
    }
    if(err) {
      res.header('Content-Type', 'application/json');
      res.send(statusCode, {error: err, body: doc});
    } else {
      res.header('Content-Type', 'application/json');
      doc["data"]["serviceUrl"] = req.url
      if (res.locals.serviceBase) {
        doc["data"]["serviceBase"] = res.locals.serviceBase;
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
  return function(db, err, url, statusCode) {
    if (statusCode === undefined) {
      statusCode = 404;
    }
    if(err) {
      res.send(statusCode, {error: err, url: url});
    } else {
      res.redirect(res.locals.serviceBase + url);
    }
    db.close();
  };
}

app.get('/tracker/api/studies/:study', 
  tracker.connected(function(err, db, req, res) {
    res.locals.serviceBase = '/tracker/api';
    tracker.getStudy(err, db, req, sendGetResponse(req, res));
  })
);

app.get('/tracker/api/studies/:study/:role/:identity',
  tracker.connected(function(err, db, req, res) {
    res.locals.serviceBase = '/tracker/api';
    tracker.getEntity(err, db, req, sendGetResponse(req, res));
  })
);

app.get('/tracker/api/studies/:study/:role/:identity/step/:step',
  tracker.connected(function(err, db, req, res) {
    res.locals.serviceBase = '/tracker/api';
    tracker.getEntityStep(err, db, req, sendGetResponse(req, res));
  })
);

app.get('/tracker/api/studies/:study/:role',
  tracker.connected(function(err, db, req, res) {
    res.locals.serviceBase = '/tracker/api';
    tracker.getEntities(err, db, req, sendGetResponse(req, res));
  })
);

app.get('/tracker/api/views/:study/:role', 
  tracker.connected(function(err, db, req, res) {
    res.locals.serviceBase = '/tracker/api';
    tracker.getViews(err, db, req, sendGetResponse(req, res));
  })
);

// Post responses are handled differently. We don't really want to return a 
// body, we want to redirect, a la PRG pattern http://www.theserverside.com/news/1365146/Redirect-After-Post
app.post('/tracker/api/studies/:study/:role/:identity/step/:step', 
  tracker.connected(function(err, db, req, res) {
    res.locals.serviceBase = '/tracker/api';
    tracker.postEntityStep(err, db, req, sendPostResponse(req, res));
  })
);

// Mocking 
app.post('/tracker/api/studies/:study/:role/:identity/step/:step/files', 
  tracker.connected(function(err, db, req, res) {
    res.locals.serviceBase = '/tracker/api';
    tracker.postEntityStepFiles(err, db, req, sendPostResponse(req, res));
  })
);

app.get('/tracker/api/*', function(req, res) {
  res.send(404);
});

