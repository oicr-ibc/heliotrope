require.extensions['.testjs'] = require.extensions['.js'];

var fs = require('fs'),
    sys = require('sys'),
    mongo = require("mongodb"),
    MongoClient = mongo.MongoClient,
    tracker = require("../lib/trackerImplementation"),
    should = require('should'),
    initialize = require('./initialize');

describe('GET request', function() {

  var db;

  beforeEach(function(done) {
    initialize.withDB("tracker", function(idb, ierr, iresult) {
      db = idb;
      done();
    });
  });

  describe('/admin/steps/GPS/participants/participant', function() {
    it('should retrieve a step definition', function(done) {
      db.close();
      
      var request = {"params": {"study" : "GPS", "role" : "participants", "step" : "participant"}, "user": {"userId": "swatt"}};
      var response = {locals: {passthrough: "value"}};
      tracker.getStudyStep(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        should.not.exist(err);
        should.exist(result);
        should.exist(result.data);

        console.log (err, result);

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });

  describe('/admin/steps/GPS/participants/enrolment', function() {
    it('should retrieve a step definition', function(done) {
      db.close();
      
      var request = {"params": {"study" : "GPS", "role" : "participants", "step" : "enrolment"}, "user": {"userId": "swatt"}};
      var response = {locals: {passthrough: "value"}};
      tracker.getStudyStep(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        should.not.exist(err);
        should.exist(result);
        should.exist(result.data);

        console.log (err, result);

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });
});