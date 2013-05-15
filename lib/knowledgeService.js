// Knowledge service implementation. Nothing much to see here, move along please.

var app = module.parent.exports.app,
    config = module.parent.exports.config,
    util = require("./util");

var knowledge = require("./knowledgeImplementation");

knowledge.initialize();

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

app.get('/knowledge/api/genes/:gene',
  knowledge.connected(function(err, db, req, res) {
    res.locals.serviceBase = '/knowledge/api';
    knowledge.getGene(err, db, req, sendGetResponse(req, res));
  })
);

app.get('/knowledge/api/variants/:id', 
  knowledge.connected(function(err, db, req, res) {
    res.locals.serviceBase = '/knowledge/api';
    knowledge.getVariant(err, db, req, sendGetResponse(req, res));
  })
);

app.get('/knowledge/api/variants/:id/report', 
  knowledge.connected(function(err, db, req, res) {
    res.locals.serviceBase = '/knowledge/api';
    knowledge.getVariantReport(err, db, req, sendViewResponse(req, res, 'index'));
  })
);

app.get('/knowledge/api/queries/:query', 
  knowledge.connected(function(err, db, req, res) {
    res.locals.serviceBase = '/knowledge/api';
    knowledge.executeQuery(err, db, req, sendGetResponse(req, res));
  })
);

app.get('/knowledge/api/search', 
  knowledge.connected(function(err, db, req, res) {
    res.locals.serviceBase = '/knowledge/api';
    knowledge.executeSearch(err, db, req, sendGetResponse(req, res));
  })
);

app.get('/knowledge/api/*', function(req, res) {
  res.send(404);
});

