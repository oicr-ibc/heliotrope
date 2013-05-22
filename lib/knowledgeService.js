// Knowledge service implementation. Nothing much to see here, move along please.

var temp = require('temp'),
    fs = require("fs"),
    app = module.parent.exports.app,
    config = module.parent.exports.config,
    util = require("./util"),
    reporting = require("./reporting"),
    base = config["heliotrope"]["knowledgeUriBase"];

var knowledge = require("./knowledgeImplementation");

knowledge.initialize();

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
      doc["data"]["serviceUrl"] = req.url;
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
      doc["data"]["serviceUrl"] = req.url;
      if (res.locals.config) {
        doc["data"]["config"] = res.locals.config;
      }
      res.send(doc);
    }
    db.close();
  };
}

app.get(base + '/genes/:gene',
  knowledge.connected(function(err, db, req, res) {
    initializeResponse(res);
    knowledge.getGene(err, db, req, res, sendGetResponse(req, res));
  })
);

app.get(base + '/variants/:id', 
  knowledge.connected(function(err, db, req, res) {
    initializeResponse(res);
    knowledge.getVariant(err, db, req, res, sendGetResponse(req, res));
  })
);

app.get(base + '/variants/:id/report', 
  knowledge.connected(function(err, db, req, res) {
    initializeResponse(res);
    if (req.query && req.query["type"] == 'pdf') {
      knowledge.getVariantReport(err, db, req, res, function(db, err, doc, res, statusCode) {
        if (statusCode === undefined) {
          statusCode = 400;
        }
        if(err) {
          res.header('Content-Type', 'application/json');
          return res.send(statusCode, {error: err, body: doc});
        }
        doc["data"]["serviceUrl"] = req.url;
        if (res.locals.config) {
          doc["data"]["config"] = res.locals.config;
        }
        var view = "index";
        res.render(view, doc, function(err, html){

          temp.open('report', function(err, info) {
            fs.write(info.fd, html);
            fs.close(info.fd, function(err) {

              reporting.generatePdf(info.path, function(err, stream) {
                db.close();
                res.header('Content-Type', 'application/pdf');
                res.header('Content-Disposition', 'attachment; filename="report.pdf"');
                return stream.pipe(res);
              });

            });
          });
        });
      });
    } else {
      return knowledge.getVariantReport(err, db, req, res, sendViewResponse(req, res, 'index'));
    }
  })
);

app.get(base + '/queries/:query', 
  knowledge.connected(function(err, db, req, res) {
    initializeResponse(res);
    knowledge.executeQuery(err, db, req, res, sendGetResponse(req, res));
  })
);

app.get(base + '/search', 
  knowledge.connected(function(err, db, req, res) {
    initializeResponse(res);
    knowledge.executeSearch(err, db, req, res, sendGetResponse(req, res));
  })
);

app.get(base + '/*', function(req, res) {
  res.send(404);
});

