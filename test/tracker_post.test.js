require.extensions['.testjs'] = require.extensions['.js'];

var fs = require('fs'),
    sys = require('sys'),
    mongo = require("mongodb"),
    MongoClient = mongo.MongoClient,
    tracker = require("../lib/trackerImplementation"),
    should = require('should'),
    initialize = require('./initialize');

describe('POST request', function() {

  var db;

  beforeEach(function(done){
    initialize.withDB("tracker", function(idb, ierr, iresult) {
      db = idb;
      done();
    });
  });

  describe('/studies/GPS/participants/TST-001/step/consent', function() {
    it('should write a date field successfully', function(done){
      
      var request = {
        "params": {"study": "GPS", "role": "participants", "identity": "TST-001", "step": "consent"},
        "body": {"data": {"step": {"fields": {"consentDate": {"value": "2013-04-17T00:00:00.000"}}}}}
      };
      var response = {locals: {passthrough: "value"}};
      
      tracker.postEntityStep(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        should.not.exist(err);
        result.should.equal("/studies/GPS/participants/TST-001/step/consent");

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });

  describe('/studies/GPS/participants/TST-001/step/participant', function() {
    it('should write an identifier field successfully', function(done){
      
      var request = {
        "params": {"study": "GPS", "role": "participants", "identity": "id;new", "step": "participant"},
        "body": {"data": {"step": {"fields": {"identifier": {"identity": "TST-002"}, "institution" : {"value" : "London"}}}}}
      };
      var response = {locals: {passthrough: "value"}};
      
      tracker.postEntityStep(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        should.not.exist(err);
        result.should.equal("/studies/GPS/participants/TST-002/step/participant");

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });

  describe('/studies/GPS/participants/TST-001/step/participant', function() {
    it('should report a missing field appropriately', function(done){
      
      var request = {
        "params": {"study": "GPS", "role": "participants", "identity": "id;new", "step": "participant"},
        "body": {"data": {"step": {"fields": {"identifier": {"value": "TST-002"}}}}}
      };
      var response = {locals: {passthrough: "value"}};
      
      tracker.postEntityStep(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        should.exist(err);
        err.err.should.match(/missing fields/);
        err.err.should.match(/institution/);

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });

  describe('/studies/GPS/participants/TST-001/step/participant', function() {
    it('should report a duplicate key appropriately', function(done){
      
      var request = {
        "params": {"study": "GPS", "role": "participants", "identity": "id;new", "step": "participant"},
        "body": {"data": {"step": {"fields": {"identifier": {"identity": "TST-001"}, "institution" : {"value" : "London"}}}}}
      };
      var response = {locals: {passthrough: "value"}};
      
      tracker.postEntityStep(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        should.exist(err);
        err.code.should.equal(11000);
        err.err.should.match(/duplicate key error/);

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });

  describe('/studies/GPS/samples/TST001BIOXPAR1/step/assessSample', function() {
    it('should update a sample appropriately', function(done){
      
      var request = {
        "params": {"study": "GPS", "role": "samples", "identity": "TST001BIOXPAR1", "step": "assessSample"},
        "body": {"data": {"step": {"fields": {"dnaConcentration": {"value": "100"}, "dnaQuality" : {"value" : "Moderate"}}}}}
      };
      var response = {locals: {passthrough: "value"}};
      
      tracker.postEntityStep(null, db, request, response, function(db, err, result, res) {
        db.close();
        should.not.exist(err);
        result.should.equal("/studies/GPS/samples/TST001BIOXPAR1/step/assessSample");

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });

  describe('/studies/GPS/samples/TST001BIOXPAR1/step/assessSample', function() {
    it('should record the request user for the step', function(done){
      
      var request = {
        "user": "mungo",
        "params": {"study": "GPS", "role": "samples", "identity": "TST001BIOXPAR1", "step": "assessSample"},
        "body": {"data": {"step": {"fields": {"dnaConcentration": {"value": "100"}, "dnaQuality" : {"value" : "Moderate"}}}}}
      };
      var response = {locals: {passthrough: "value"}};
      
      tracker.postEntityStep(null, db, request, response, function(db, err, result, res) {
        should.not.exist(err);
        result.should.equal("/studies/GPS/samples/TST001BIOXPAR1/step/assessSample");

        res.locals.passthrough.should.equal("value");

        // At this stage, we ought to be able to find the entity
        db.collection("entities", function(err, entities) {
          entities.find({role: "samples", "identity": "TST001BIOXPAR1"}).limit(1).toArray(function(err, docs) {
            db.close();

            should.exist(docs);
            docs.length.should.equal(1);
            should.exist(docs[0].steps);
            docs[0].steps.length.should.equal(2);
            docs[0].steps[1].stepUser.should.equal("mungo");

            done();
          });
        });
      });
    });
  });

  describe('/studies/GPS/samples/id;new/step/sample', function() {
    it('should report a missing field appropriately', function(done){
      
      var request = {
        "params": {"study": "GPS", "role": "samples", "identity": "id;new", "step": "sample"},
        "body": {"data": {"step": {"fields": {"identifier": {"value": "TST001BIOXPAR3"}}}}}
      };
      var response = {locals: {passthrough: "value"}};
      
      tracker.postEntityStep(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        should.exist(err);
        err.err.should.match(/missing fields/);

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });

  describe('/studies/GPS/samples/id;new/step/sample', function() {
    it('should succeed with all fields set', function(done){
      
      var request = {
        "params": {"study": "GPS", "role": "samples", "identity": "id;new", "step": "sample"},
        "body": {"data": {"step": {"fields": {
          "identifier": {"identity": "TST001BIOXPAR3"},
          "participantEntityRef": {"value": "TST-001"},
          "requiresCollection": {"value": true},
          "site": {"value": "Primary"},
          "source": {"value": "Biopsy"},
          "type": {"value": "FFPE"}
        }}}}
      };
      var response = {locals: {passthrough: "value"}};
      
      tracker.postEntityStep(null, db, request, response, function(db, err, result, res) {
        db.close();

        should.not.exist(err);
        should.exist(result);
        result.should.equal('/studies/GPS/samples/TST001BIOXPAR3/step/sample');
        done();
      });
    });
  });
});

