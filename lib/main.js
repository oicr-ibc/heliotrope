/* 
    rest.js
    mongodb-rest

    Created by Tom de Grunt on 2010-10-03.
    Copyright (c) 2010 Tom de Grunt.
    This file is part of mongodb-rest.
*/ 
var mongo = require("mongodb"),
    app = module.parent.exports.app,
    config = module.parent.exports.config,
    util = require("./util"),
    BSON = mongo.BSONPure,
    MongoClient = mongo.MongoClient;

var tracker = require("./tracker");
var knowledge = require("./knowledge");

/**
 * General purpose function to send a document if one exists.
 * @param res - the response
 * @returns {Function} - with (db, err, doc) parameters
 */
function sendResponse(res) {
  return function(db, err, doc) {
    if(err) {
      res.send(404);
    } else {
      res.header('Content-Type', 'application/json');
      res.send(doc);
    }
    db.close();
  };
}

// Endpoint for the basic study element. 

app.get('/tracker/api/studies/:study', function(req, res) {
  tracker.getStudy(req, sendResponse(res));
});

app.get('/tracker/api/studies/:study/:role/:identity', function(req, res) {
  tracker.getEntity(req, sendResponse(res));
});

app.get('/tracker/api/studies/:study/:role', function(req, res) {
  tracker.getEntities(req, sendResponse(res));
});

app.get('/tracker/api/studies/:study/:role/:identity/step/:step', function(req, res) {
  tracker.getEntityStep(req, sendResponse(res));
});

app.get('/tracker/api/views/:study/:role', function(req, res) {
  tracker.getViews(req, sendResponse(res));
});

app.get('/knowledge/api/genes/:gene', function(req, res) {
  knowledge.getGene(req, sendResponse(res));
});

app.get('/knowledge/api/variants/:id', function(req, res) {
  knowledge.getVariant(req, sendResponse(res));
});

app.get('/knowledge/api/queries/:query', function(req, res) {
  knowledge.executeQuery(req, sendResponse(res));
});

app.get('/tracker/api/*', function(req, res) {
  res.send(404);
});

app.get('/knowledge/api/*', function(req, res) {
  res.send(404);
});

app.get('/test/*', function(req, res){
  var file = './webapp/test/' + req.params[0];
  res.sendfile(file);
});

app.get('/*', function(req, res){
  //var path = req.params[0] ? req.params[0] : 'index.html';
  var file = './webapp/app/index.html';
  if (!res.getHeader('Cache-Control')) {
    res.setHeader('Cache-Control', 'public, max-age=3600');
  }
  res.sendfile(file);
});

//
///**
// * Query
// */
//app.get('/:db/:collection/:id?', function(req, res) { 
//  var query = req.query.query ? JSON.parse(req.query.query) : {};
//
//  // Providing an id overwrites giving a query in the URL
//  if (req.params.id) {
//    query = {'_id': new BSON.ObjectID(req.params.id)};
//  }
//  var options = req.params.options || {};
//
//  var test = ['limit','sort','fields','skip','hint','explain','snapshot','timeout'];
//
//  for( o in req.query ) {
//    if( test.indexOf(o) >= 0 ) {
//      options[o] = req.query[o];
//    } 
//  }
//  
//  var db = new mongo.Db(req.params.db, new mongo.Server(config.db.host, config.db.port, {'auto_reconnect':true}));
//  db.open(function(err,db) {
//    db.authenticate(config.db.username, config.db.password, function () {
//      db.collection(req.params.collection, function(err, collection) {
//        collection.find(query, options, function(err, cursor) {
//          cursor.toArray(function(err, docs){
//            var result = [];          
//            if(req.params.id) {
//              if(docs.length > 0) {
//                result = util.flavorize(docs[0], "out");
//                res.header('Content-Type', 'application/json');
//                res.send(result);
//              } else {
//                res.send(404);
//              }
//            } else {
//              docs.forEach(function(doc){
//                result.push(util.flavorize(doc, "out"));
//              });
//              res.header('Content-Type', 'application/json');
//              res.send(result);
//            }
//            db.close();
//          });
//        });
//      });
//    });
//  });
//});
//
///**
// * Insert
// */
//app.post('/:db/:collection', function(req, res) {
//  if(req.body) {
//    var db = new mongo.Db(req.params.db, new mongo.Server(config.db.host, config.db.port, {'auto_reconnect':true}));
//    db.open(function(err, db) {
//      db.authenticate(config.db.username, config.db.password, function () {
//        db.collection(req.params.collection, function(err, collection) {
//          // We only support inserting one document at a time
//          collection.insert(Array.isArray(req.body) ? req.body[0] : req.body, function(err, docs) {
//            res.header('Location', '/'+req.params.db+'/'+req.params.collection+'/'+docs[0]._id.toHexString());
//            res.header('Content-Type', 'application/json');
//            res.send('{"ok":1}', 201);
//            db.close();
//          });
//        });
//      });
//    });
//  } else {
//    res.header('Content-Type', 'application/json');
//    res.send('{"ok":0}',200);
//  }
//});
//
///**
// * Update
// */
//app.put('/:db/:collection/:id', function(req, res) {
//  var spec = {'_id': new BSON.ObjectID(req.params.id)};
//
//  var db = new mongo.Db(req.params.db, new mongo.Server(config.db.host, config.db.port, {'auto_reconnect':true}));
//  db.open(function(err, db) {
//    db.authenticate(config.db.username, config.db.password, function () {
//      db.collection(req.params.collection, function(err, collection) {
//        collection.update(spec, req.body, true, function(err, docs) {
//          res.header('Content-Type', 'application/json');
//          res.send('{"ok":1}');
//          db.close();
//        });
//      });
//    });
//  });
//});
//
///**
// * Delete
// */
//app.del('/:db/:collection/:id', function(req, res) {
//  var spec = {'_id': new BSON.ObjectID(req.params.id)};
// 
//  var db = new mongo.Db(req.params.db, new mongo.Server(config.db.host, config.db.port, {'auto_reconnect':true}));
//  db.open(function(err, db) {
//    db.authenticate(config.db.username, config.db.password, function () {
//      db.collection(req.params.collection, function(err, collection) {
//        collection.remove(spec, function(err, docs) {
//          res.header('Content-Type', 'application/json');
//          res.send('{"ok":1}');
//          db.close();
//        });
//      });
//    });
//  });
//});