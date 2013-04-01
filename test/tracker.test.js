var fs = require('fs'),
    mongo = require("mongodb"),
    MongoClient = mongo.MongoClient,
    tracker = require("../lib/tracker");

function withDB(callback) {
  fs.readFile('test/data.js', function (err, data) {
    if (err) throw err;
    MongoClient.connect("mongodb://localhost:27017/tracker", function(err, db) {
      db.eval(data.toString(), [], 
        function(err, result) {
          callback(db, err, result);
      });
    });
  });
}

exports.testGetStudy = function(beforeExit, assert) {
  withDB(function(db, err, result) {
    db.close();
    
    var request = {params: {study: "GPS"}};
    tracker.getStudy(request, function(db, err, result) {
      db.close();
      assert.equal("GPS", result.data.name);
      assert.equal("/studies/GPS", result.data.url);
    });
  });
};

exports.testGetEntitiesParticipants = function(beforeExit, assert) {
  withDB(function(db, err, result) {
    db.close();
    
    var request = {params: {study: "GPS", role: "participants"}};
    tracker.getEntities(request, function(db, err, result) {
      db.close();
      assert.equal(1, result.data.length);
      assert.equal("TST-001", result.data[0].identity);
    });
  });
};

exports.testGetEntitiesSamples = function(beforeExit, assert) {
  withDB(function(db, err, result) {
    db.close();
    
    var request = {params: {study: "GPS", role: "samples"}};
    tracker.getEntities(request, function(db, err, result) {
      db.close();
      assert.equal(2, result.data.length);
      assert.equal("TST001BIOXPAR1", result.data[0].identity);
      assert.equal("TST001BIOXPAR2", result.data[1].identity);
    });
  });
};

exports.testGetEntity = function(beforeExit, assert) {
  withDB(function(db, err, result) {
    db.close();
    
    var request = {params: {study: "GPS", role: "participants", identity: "TST-001"}};
    tracker.getEntity(request, function(db, err, result) {
      db.close();
      assert.equal("TST-001", result.data.identity);
      assert.equal("/studies/GPS/participants/TST-001", result.data.url);
      assert.equal("participants", result.data.role);
    });
  });
};

