require.extensions['.testjs'] = require.extensions['.js'];

var fs = require('fs'),
    sys = require('sys'),
    mongo = require("mongodb"),
    BSON = mongo.BSONPure,
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
        "body": {"data": {"step": {"fields": {"consentDate": {"value": "2013-04-17T00:00:00.000"}}}}},
        "user": {"userId": "swatt"}
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

  describe('/studies/GPS/participants/TST-001/step/consent', function() {
    it('should fail to write a date field successfully for a disallowed user', function(done){
      
      var request = {
        "params": {"study": "GPS", "role": "participants", "identity": "TST-001", "step": "consent"},
        "body": {"data": {"step": {"fields": {"consentDate": {"value": "2013-04-17T00:00:00.000"}}}}},
        "user": {"userId": "mungo"}
      };
      var response = {locals: {passthrough: "value"}};
      
      tracker.postEntityStep(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        should.exist(err);
        should.exist(err.error);
        err.error.should.equal("Forbidden");
        should.exist(res.locals.statusCode);
        res.locals.statusCode.should.equal(403);

        done();
      });
    });
  });

  describe('/studies/GPS/participants/TST-001/step/consent', function() {
    it('should fail to write a date field successfully for a user with read access', function(done){
      
      var request = {
        "params": {"study": "GPS", "role": "participants", "identity": "TST-001", "step": "consent"},
        "body": {"data": {"step": {"fields": {"consentDate": {"value": "2013-04-17T00:00:00.000"}}}}},
        "user": {"userId": "oloudon"}
      };
      var response = {locals: {passthrough: "value"}};
      
      tracker.postEntityStep(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        should.exist(err);
        should.exist(err.error);
        err.error.should.equal("Forbidden");
        should.exist(res.locals.statusCode);
        res.locals.statusCode.should.equal(403);

        done();
      });
    });
  });

  describe('/studies/GPS/participants/TST-001/step/participant', function() {
    it('should write an identifier field successfully', function(done){
      
      var request = {
        "params": {"study": "GPS", "role": "participants", "identity": "id;new", "step": "participant"},
        "body": {"data": {"step": {"fields": {"identifier": {"identity": "TST-002"}, "institution" : {"value" : "London"}}}}},
        "user": {"userId": "swatt"}
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
        "body": {"data": {"step": {"fields": {"identifier": {"value": "TST-002"}}}}},
        "user": {"userId": "swatt"}
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
        "body": {"data": {"step": {"fields": {"identifier": {"identity": "TST-001"}, "institution" : {"value" : "London"}}}}},
        "user": {"userId": "swatt"}
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
        "body": {"data": {"step": {"fields": {"dnaConcentration": {"value": "100"}, "dnaQuality" : {"value" : "Moderate"}}}}},
        "user": {"userId": "swatt"}
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
        "params": {"study": "GPS", "role": "samples", "identity": "TST001BIOXPAR1", "step": "assessSample"},
        "body": {"data": {"step": {"fields": {"dnaConcentration": {"value": "100"}, "dnaQuality" : {"value" : "Moderate"}}}}},
        "user": {"userId": "swatt"}
      };
      var response = {locals: {passthrough: "value"}};
      
      tracker.postEntityStep(null, db, request, response, function(db, err, result, res) {
        should.not.exist(err);
        result.should.equal("/studies/GPS/samples/TST001BIOXPAR1/step/assessSample");

        res.locals.passthrough.should.equal("value");

        // At this stage, we ought to be able to find the entity
        db.collection("entities", function(err, entities) {
          entities.find({studyId: new BSON.ObjectID("51a4e7df9be0f733f234e6a5"), role: "samples", "identity": "TST001BIOXPAR1"}).limit(1).toArray(function(err, docs) {
            db.close();

            should.exist(docs);
            docs.length.should.equal(1);
            should.exist(docs[0].steps);
            docs[0].steps.length.should.equal(2);
            docs[0].steps[1].stepUser.should.equal("swatt");

            done();
          });
        });
      });
    });
  });

  function getFields(entity, stepId) {
    var filteredSteps = entity.steps.filter(function(step) { return step.id.toString() === stepId});
    filteredSteps.length.should.equal(1);
    var fields = {};
    filteredSteps[0].fields.forEach(function(field) {
      fields[field["key"]] = field;
    });
    return fields;
  }

  // Make sure we can distinguish and update a step with an identity
  describe('/studies/GPS/participants/TST-001/step/biopsy;511d2295ea2a8c2f1e2c1ff2', function() {
    it('should update a sample appropriately', function(done){
      
      var request = {
        "params": {"study": "GPS", "role": "participants", "identity": "TST-001", "step": "biopsy;511d2295ea2a8c2f1e2c1ff2"},
        "body": {"data": {"step": {"fields": {"biopsyDate": {"value": "2013-01-01T01:01:01.000"}, "biopsyCores" : {"value" : "9"}}}}},
        "user": {"userId": "swatt"}
      };
      var response = {locals: {passthrough: "value"}};
      
      tracker.postEntityStep(null, db, request, response, function(db, err, result, res) {

        should.not.exist(err);
        result.should.equal("/studies/GPS/participants/TST-001/step/biopsy;511d2295ea2a8c2f1e2c1ff2");
        res.locals.passthrough.should.equal("value");

        // When done, peek in the database to see what we can find.
        db.collection("entities", function(err, entities) {
          entities.find({studyId: new BSON.ObjectID("51a4e7df9be0f733f234e6a5"), role: "participants", identity: "TST-001"}).limit(1).toArray(function(err, docs) {

            db.close();

            should.exist(docs);
            docs.length.should.equal(1);
            should.exist(docs[0].steps);

            var fields = getFields(docs[0], "511d2295ea2a8c2f1e2c1ff2")
            should.exist(fields["biopsyDate"]);
            should.exist(fields["biopsyDate"]["value"]);
            fields["biopsyDate"]["value"].should.equal("2013-01-01T01:01:01.000");

            done();
          });
        });
      });
    });
  });

  // Same again, but with the other instance, so we can confirm that even a later step definition
  // can be updated without affecting the first. 
  describe('/studies/GPS/participants/TST-001/step/biopsy;51a4e3d99be0f733f234e6a4', function() {
    it('should update a sample appropriately', function(done){
      
      var request = {
        "params": {"study": "GPS", "role": "participants", "identity": "TST-001", "step": "biopsy;51a4e3d99be0f733f234e6a4"},
        "body": {"data": {"step": {"fields": {"biopsyDate": {"value": "2013-02-02T02:02:02.000"}, "biopsyCores" : {"value" : "9"}}}}},
        "user": {"userId": "swatt"}
      };
      var response = {locals: {passthrough: "value"}};
      
      tracker.postEntityStep(null, db, request, response, function(db, err, result, res) {
        should.not.exist(err);
        result.should.equal("/studies/GPS/participants/TST-001/step/biopsy;51a4e3d99be0f733f234e6a4");
        res.locals.passthrough.should.equal("value");

        // When done, peek in the database to see what we can find.
        db.collection("entities", function(err, entities) {
          entities.find({studyId: new BSON.ObjectID("51a4e7df9be0f733f234e6a5"), role: "participants", identity: "TST-001"}).limit(1).toArray(function(err, docs) {

            db.close();

            should.exist(docs);
            docs.length.should.equal(1);
            should.exist(docs[0].steps);

            var fields = getFields(docs[0], "51a4e3d99be0f733f234e6a4")
            should.exist(fields["biopsyDate"]);
            should.exist(fields["biopsyDate"]["value"]);
            fields["biopsyDate"]["value"].should.equal("2013-02-02T02:02:02.000");

            done();
          });
        });
      });
    });
  });

  // And now for a third time. When we do a biopsy without a step identifier, this should create a
  // new step, making three in all. 
  describe('/studies/GPS/participants/TST-001/step/biopsy', function() {
    it('should update a sample appropriately', function(done){
      
      var request = {
        "params": {"study": "GPS", "role": "participants", "identity": "TST-001", "step": "biopsy"},
        "body": {"data": {"step": {"fields": {"biopsyDate": {"value": "2013-02-02T02:02:02.000"}, "biopsyCores" : {"value" : "9"}}}}},
        "user": {"userId": "swatt"}
      };
      var response = {locals: {passthrough: "value"}};
      
      tracker.postEntityStep(null, db, request, response, function(db, err, result, res) {
        should.not.exist(err);
        result.should.match(/\/studies\/GPS\/participants\/TST-001\/step\/biopsy\;[0-9a-z]{24,24}/);
        res.locals.passthrough.should.equal("value");

        // When done, peek in the database to see what we can find.
        db.collection("entities", function(err, entities) {
          entities.find({studyId: new BSON.ObjectID("51a4e7df9be0f733f234e6a5"), role: "participants", identity: "TST-001"}).limit(1).toArray(function(err, docs) {

            db.close();

            should.exist(docs);
            docs.length.should.equal(1);
            should.exist(docs[0].steps);

            // Make sure all steps have a stepRef set 
            docs[0].steps.filter(function(step) { return !step["stepRef"]; }).length.should.equal(0);

            // We should now find three steps with a biopsyDate field.
            var steps = docs[0].steps.filter(function(step) {
              return step.fields.some(function(field) {
                return field.key === "biopsyDate";
              })
            });

            steps.length.should.equal(3);

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
        "body": {"data": {"step": {"fields": {"identifier": {"value": "TST001BIOXPAR3"}}}}},
        "user": {"userId": "swatt"}
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
        }}}},
        "user": {"userId": "swatt"}
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

  describe('/studies/GPS/samples/id;new/step/sample', function() {
    it('should report a missing barcode appropriately', function(done){
      
      var request = {
        "params": {"study": "GPS", "role": "samples", "identity": "id;new", "step": "sample"},
        "body": {"data": {"step": {"fields": {
          "participantEntityRef": {"value": "TST-001"},
          "requiresCollection": {"value": true},
          "site": {"value": "Primary"},
          "source": {"value": "Biopsy"},
          "type": {"value": "FFPE"}
        }}}},
        "user": {"userId": "swatt"}
      };
      var response = {locals: {passthrough: "value"}};
      
      tracker.postEntityStep(null, db, request, response, function(db, err, result, res, statusCode) {
        db.close();

        should.exist(err);
        statusCode.should.equal(400);        
        err.err.should.match(/missing fields/);

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });
});

