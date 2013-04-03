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

exports.testGetEntityStep = function(beforeExit, assert) {
  withDB(function(db, err, result) {
    db.close();
    
    var request = {params: {study: "GPS", role: "participants", identity: "TST-001", step: "consent"}};
    tracker.getEntityStep(request, function(db, err, result) {
    debugger;
      db.close();
      assert.equal("TST-001", result.data.identity);
      assert.equal("/studies/GPS/participants/TST-001", result.data.url);
      assert.equal("consent", result.data.step.name);
      assert.equal("Consent", result.data.step.label);
      assert.equal("date", result.data.step.fields.consentDate.controlType);
      assert.equal("Date", result.data.step.fields.consentDate.type);
      assert.equal("Consent date", result.data.step.fields.consentDate.label);
      assert.equal("2012-11-13T18:45:00.000", result.data.step.fields.consentDate.value);
    });
  });
};

exports.testGetEntityStepSample = function(beforeExit, assert) {
  withDB(function(db, err, result) {
    db.close();
    
    var request = {params: {study: "GPS", role: "samples", identity: "TST001BIOXPAR1", step: "assessSample"}};
    tracker.getEntityStep(request, function(db, err, result) {
      db.close();
      assert.equal("TST001BIOXPAR1", result.data.identity);
      assert.equal("/studies/GPS/samples/TST001BIOXPAR1", result.data.url);
      assert.equal("assessSample", result.data.step.name);
    });
  });
};

// This test handles the case of writing a step which already exists. The new 
// values should be both stored and returned in the new body. 
exports.testPostEntityStepExists = function(beforeExit, assert) {
  withDB(function(db, err, result) {
    db.close();
    
    var request = {
      "params": {"study": "GPS", "role": "participants", "identity": "TST-001", "step": "consent"},
      "body": {"data": {"step": {"fields": {"consentDate": {"value": "2013-04-17T00:00:00.000"}}}}}
    }
    
    debugger;
    tracker.postEntityStep(request, function(db, err, result) {
      debugger;
      db.close();
      assert.equal("TST-001", result.data.identity);
      assert.equal("/studies/GPS/participants/TST-001", result.data.url);
      assert.equal("consent", result.data.step.name);
      assert.equal("Consent", result.data.step.label);
      assert.equal("date", result.data.step.fields.consentDate.controlType);
      assert.equal("Date", result.data.step.fields.consentDate.type);
      assert.equal("Consent date", result.data.step.fields.consentDate.label);
      assert.equal("2013-04-17T00:00:00.000", result.data.step.fields.consentDate.value);
    });
  });
};

exports.testViewsSamples = function(beforeExit, assert) {
  withDB(function(db, err, result) {
    db.close();
    
    var request = {params: {study: "GPS", role: "samples"}};
    tracker.getViews(request, function(db, err, result) {
      db.close();
      console.error("Result", result);
    });
  });
};

