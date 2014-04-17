// Knowledge service implementation. Nothing much to see here, move along please.

module.exports.log4js = module.parent.exports.log4js;
module.exports.logger = module.parent.exports.logger;

var temp = require('temp'),
    fs = require("fs"),
    app = module.parent.exports.app,
    config = module.parent.exports.config,
    reporting = require("./reporting"),
    base = config["heliotrope"]["knowledgeUriBase"],
    authentication = require("./authentication");

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
      res.redirect(res.locals.config["knowledgeUriBase"] + url);
    }
    db.close();
  };
}

app.get(base + '/genes/:gene',
  knowledge.connected(config["data"]["knowledgedb"], function(err, db, req, res) {
    initializeResponse(res);
    knowledge.getGene(err, db, req, res, sendGetResponse(req, res));
  })
);

app.get(base + '/variants/:id', 
  knowledge.connected(config["data"]["knowledgedb"], function(err, db, req, res) {
    initializeResponse(res);
    knowledge.getVariant(err, db, req, res, sendGetResponse(req, res));
  })
);

app.get(base + '/publications/:type/:id',
  knowledge.connected(config["data"]["knowledgedb"], function(err, db, req, res) {
    initializeResponse(res);
    knowledge.getPublication(err, db, req, res, sendGetResponse(req, res));
  })
);

// PUT requests require authentication, and properly authorization too. 
app.put(base + '/variants/:id', authentication.accessAuthenticator(),
  knowledge.connected(config["data"]["knowledgedb"], function(err, db, req, res) {
    initializeResponse(res);
    knowledge.putVariant(err, db, req, res, sendGetResponse(req, res));
  })
);

// POST requests require authentication, and properly authorization too. This is
// not public, as it is primarily a service endpoint that can be used create a 
// bunch of variants from, e.g., VCF file parsing. The POST system needs to be
// idempotent and accessible over web access. 
app.post(base + '/variants', authentication.apiAuthenticator(),
  knowledge.connected(config["data"]["knowledgedb"], function(err, db, req, res) {
    initializeResponse(res);
    knowledge.postVariant(err, db, req, res, sendPostResponse(req, res));
  })
);

app.get(base + '/variants/:id/report', 
  knowledge.connected(config["data"]["knowledgedb"], function(err, db, req, res) {
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
        res.render(view, doc, function(err, html) {
          var buffer = new Buffer(html);

          temp.open('report', function(err, info) {

            if (err) {
              console.error("Failed to open file", err);
            }
            fs.write(info.fd, buffer, 0, buffer.length, null, function(err, written, buffer) {
              if (err) {
                console.error("Failed to open file", err);
              }
              fs.close(info.fd, function(err) {
                if (err) {
                  console.error("Failed to open file", err);
                }
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
      });
    } else {
      return knowledge.getVariantReport(err, db, req, res, sendViewResponse(req, res, 'index'));
    }
  })
);

app.get(base + '/tumourTypes',
  knowledge.connected(config["data"]["knowledgedb"], function(err, db, req, res) {
    initializeResponse(res);
    knowledge.geTumourTypes(err, db, req, res, sendGetResponse(req, res));
  })
);

app.get(base + '/queries/:query', 
  knowledge.connected(config["data"]["knowledgedb"], function(err, db, req, res) {
    initializeResponse(res);
    knowledge.executeQuery(err, db, req, res, sendGetResponse(req, res));
  })
);

app.get(base + '/search', 
  knowledge.connected(config["data"]["knowledgedb"], function(err, db, req, res) {
    initializeResponse(res);
    knowledge.executeSearch(err, db, req, res, sendGetResponse(req, res));
  })
);

app.get(base + '/*', function(req, res) {
  res.send(404);
});

