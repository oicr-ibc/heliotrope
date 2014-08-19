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

  describe('/steps/GPS/participants/participant', function() {
    it('should retrieve a step definition', function(done) {
      db.close();

      var request = {"params": {"study" : "GPS", "role" : "participants", "step" : "participant"}, "user": {"userId": "swatt"}};
      var response = {locals: {passthrough: "value"}};
      tracker.getStudyStep(null, db, request, response, function(db, err, result, res) {
        db.close();

        should.not.exist(err);
        should.exist(result);
        should.exist(result.data);

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });

  describe('/steps/GPS/participants/enrolment', function() {
    it('should retrieve a step definition', function(done) {
      db.close();

      var request = {"params": {"study" : "GPS", "role" : "participants", "step" : "enrolment"}, "user": {"userId": "swatt"}};
      var response = {locals: {passthrough: "value"}};
      tracker.getStudyStep(null, db, request, response, function(db, err, result, res) {
        db.close();

        should.not.exist(err);
        should.exist(result);
        should.exist(result.data);

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });

  describe('/views/GPS/participants/summary', function() {
    it('should retrieve a view definition', function(done) {
      db.close();

      var request = {"params": {"study" : "GPS", "role" : "participants", "view" : "summary"}, "user": {"userId": "swatt"}};
      var response = {locals: {passthrough: "value"}};
      tracker.getStudyView(null, db, request, response, function(db, err, result, res) {
        db.close();

        should.not.exist(err);
        should.exist(result);
        should.exist(result.data);
        should.exist(result.data.study);
        should.exist(result.data.view);

        result.data.view.name.should.equal("summary");
        result.data.view.role.should.equal("participants");
        should.exist(result.data.view.body);

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });
});

describe('POST request', function() {

  var db;

  beforeEach(function(done) {
    initialize.withDB("tracker", function(idb, ierr, iresult) {
      db = idb;
      done();
    });
  });

  describe('/steps/GPS', function() {
    it('should create a step definition', function(done) {
      db.close();

      var request = {"params": {"study" : "GPS"}, "user": {"userId": "swatt"}};
      var response = {locals: {passthrough: "value"}};
      request["body"] = {
        "data": {
          "step" : {
            "name": "interviewing",
            "appliesTo": "participants",
            "label": { "default" : "Interviewing" },
            "isRepeatable": false,
            "showSummary": true,
            "weight": 20,
            "fields": {
              "interviewDate" : {
                "controlType": "date",
                "isRequired": true,
                "type": "Date",
                "label": { "default" : "Interview date" }
              }
            }
          }
        }
      };

      tracker.postStudyStep(null, db, request, response, function(db, err, result, res) {
        db.close();

        should.not.exist(err);
        should.exist(result);
        result.should.equal("/steps/GPS/participants/interviewing");

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });


  describe('/views/GPS', function() {
    it('should create a view definition', function(done) {
      db.close();

      var request = {"params": {"study" : "GPS"}, "user": {"userId": "swatt"}};
      var response = {locals: {passthrough: "value"}};
      request["body"] = {
        "data": {
          "view" : {
            "name": "report",
            "role": "participants",
            "label": { "default" : "Interviewing" },
            "weight": 3.1415927,
            "body": "<p>Testing</p>"
          }
        }
      };

      tracker.postStudyView(null, db, request, response, function(db, err, result, res) {
        db.close();

        should.not.exist(err);
        should.exist(result);
        result.should.equal("/views/GPS/participants/report");

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });
});