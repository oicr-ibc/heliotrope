require.extensions['.testjs'] = require.extensions['.js'];

var fs = require('fs'),
    sys = require("sys"),
    mongo = require("mongodb"),
    MongoClient = mongo.MongoClient,
    tracker = require("../lib/trackerImplementation"),
    should = require('should'),
    initialize = require('./initialize');

describe('Tracker component', function() {

  var db;

  beforeEach(function(done) {
    initialize.withDB("tracker", function(idb, ierr, iresult) {
      db = idb;
      done();
    });
  });

  describe('checkAdminAccess', function() {
    var req = {"user": {"userId" : "swatt", "roles": ["ADMIN"]}};

    it('should allow read access for admin permissions', function(done) {
      tracker.checkAdminAccess(req, "read").should.equal(true);
      done();
    });

    it('should allow modify access for admin permissions', function(done) {
      tracker.checkAdminAccess(req, "modify").should.equal(true);
      done();
    });
  });

  describe('checkAccessList', function() {

    var access = [{
      "modify" : ["mweisner"],
      "read": ["acavender", "mweisner"],
      "none": ["sboon"]
    }, {
      "modify" : ["ehoag", "acavender"],
      "read": ["oloudon", "mweisner", "sboon"]
    }];

    it('should allow inherited read access for read permissions', function(done) {
      tracker.checkAccessList({"user": {"userId" : "ehoag"}}, access, "read").should.equal(true);
      done();
    });

    it('should allow inherited modify access for modify permissions', function(done) {
      tracker.checkAccessList({"user": {"userId" : "ehoag"}}, access, "modify").should.equal(true);
      done();
    });

    it('should block inherited modify access for read permissions', function(done) {
      tracker.checkAccessList({"user": {"userId" : "oloudon"}}, access, "modify").should.equal(false);
      done();
    });

    it('should allow inherited read access for read permissions', function(done) {
      tracker.checkAccessList({"user": {"userId" : "oloudon"}}, access, "read").should.equal(true);
      done();
    });

    it('should allow non-inherited read access for read permissions', function(done) {
      tracker.checkAccessList({"user": {"userId" : "acavender"}}, access, "read").should.equal(true);
      done();
    });

    it('should allow non-inherited modify access for modify permissions', function(done) {
      tracker.checkAccessList({"user": {"userId" : "mweisner"}}, access, "modify").should.equal(true);
      done();
    });

    it('should block non-inherited modify access for read permissions', function(done) {
      tracker.checkAccessList({"user": {"userId" : "acavender"}}, access, "modify").should.equal(false);
      done();
    });

    it('should allow inherited read access for read permissions', function(done) {
      tracker.checkAccessList({"user": {"userId" : "acavender"}}, access, "read").should.equal(true);
      done();
    });

    it('should block read access for no permissions', function(done) {
      tracker.checkAccessList({"user": {"userId" : "mungo"}}, access, "read").should.equal(false);
      done();
    });

    it('should block modify access for no permissions', function(done) {
      tracker.checkAccessList({"user": {"userId" : "mungo"}}, access, "modify").should.equal(false);
      done();
    });

    it('should block modify access for denied permissions', function(done) {
      tracker.checkAccessList({"user": {"userId" : "sboon"}}, access, "modify").should.equal(false);
      done();
    });

    it('should block read access for denied permissions', function(done) {
      tracker.checkAccessList({"user": {"userId" : "sboon"}}, access, "read").should.equal(false);
      done();
    });
  });

  describe('annotateEntity', function() {
    it('should handle an empty query list', function(done){
      var object = {};
      
      tracker.annotateEntity(db, object, [], function(o) {
        db.close();
        
        object.hasOwnProperty('count').should.be.false;
        done();
      });
    });

    it('should be able to add a basic query', function(done){
      var object = {};
      
      var query = {
        collection : "entities",
        query : {"role" : "participants"},
        fields : {},
        callback : function(object, results, next) {
          object["values"] = results;
          return next();
        }
      };
      tracker.annotateEntity(db, object, [query], function(o) {
        db.close();
        
        object.hasOwnProperty('values').should.be.true;
        object.values.length.should.equal(1);
        object.values[0].identity.should.equal("TST-001");
        done();
      });
    });

    it('should be able to add a counting query', function(done){
      var object = {};
      
      var query = {
        collection : "entities",
        query : {"role" : "samples"},
        fields : {},
        cursor : function(c, callback) { 
          return c.count(callback);
        },
        callback : function(object, results, next) {
          object["values"] = results;
          return next();
        }
      };
      tracker.annotateEntity(db, object, [query], function(o) {
        db.close();
        
        object.hasOwnProperty('values').should.be.true;
        object.values.should.equal(2);
        done();
      });
    });
  
    it('should be able to use an aggregation pipeline', function(done){
      var object = {};
      
      var query = {
        collection : "entities",
        aggregation : [
          {"$project" : { "role" : 1}},
          {"$group" : {"_id" : "$role", "count" : {"$sum" : 1}}}
        ],
        callback : function(object, results, next) {
          var counts = {};
          results.forEach(function(e) {
            counts[e["_id"]] = e["count"];
          });
          object["counts"] = counts;
          return next();
        }
      };
      tracker.annotateEntity(db, object, [query], function(o) {
        db.close();
        
        o.hasOwnProperty('counts').should.be.true;
        o.counts.hasOwnProperty('participants').should.be.true;
        o.counts.hasOwnProperty('samples').should.be.true;
        o.counts.hasOwnProperty('observations').should.be.true;
        o.counts.participants.should.equal(1);
        o.counts.samples.should.equal(2);
        o.counts.observations.should.equal(1);
        done();
      });
    });

    it('should be able to handle multiple queries', function(done){
      var object = {};
      
      var query1 = {
        collection : "entities",
        query : {"role" : "samples"},
        fields : {},
        callback : function(object, results, next) {
          object["samples"] = results;
          return next();
        }
      };
      var query2 = {
        collection : "entities",
        query : {"role" : "observations"},
        fields : {},
        callback : function(object, results, next) {
          object["observations"] = results;
          return next();
        }
      };
      tracker.annotateEntity(db, object, [query1, query2], function(o) {
        db.close();
        
        object.hasOwnProperty('samples').should.be.true;
        object.samples.length.should.equal(2);
        object.hasOwnProperty('observations').should.be.true;
        object.observations[0].name.should.equal("KRAS p.Gly12Asp");
        done();
      });
    });
  })

  describe('findStepUpdater', function() {
  
    it('should build an simple updater', function(done){
    
      initialize.withStudy(db, "GPS", function(err, study) {

        var step = {
            name: 'participant',
            stepOptions: { method: 'CreateEntity' },
            fields: { 
              identifier: { 
                type: 'String',
                isRequired: true,
                isIdentity: true },
              institution:  { 
                type: 'String',
                range: ["London", "Hamilton", "Europa"],
                isRequired: true }}};

        var fields = { identifier: { identity: 'TST-002' }, institution: { value: 'London' } };
        
        tracker.findStepUpdater(db, study._id, step, fields, {}, {"$set" : {"steps.$.fields" : []}}, function(db, err, updater) {
          db.close();

          updater["$set"]["steps.$.fields"][0]["identity"].should.equal("TST-002");
          updater["$set"]["steps.$.fields"][0]["key"].should.equal("identifier");
          updater["$set"]["steps.$.fields"][1]["value"].should.equal("London");
          updater["$set"]["steps.$.fields"][1]["key"].should.equal("institution");
          done();
        });

      });
    });
  
    it('should report a missing field', function(done){
      
      initialize.withStudy(db, "GPS", function(err, study) {

        var step = {
            name: 'participant',
            stepOptions: { method: 'CreateEntity' },
            fields: { 
              identifier: { 
                type: 'String',
                isRequired: true,
                isIdentity: true },
              institution:  { 
                type: 'String',
                range: ["London", "Hamilton", "Europa"],
                isRequired: true }}};
        var fields = { identifier: { value: 'TST-002' } };
        
        tracker.findStepUpdater(db, study._id, step, fields, {}, {"$set" : {"steps.$.fields" : []}}, function(db, err, updater) {
          db.close();
          
          should.exist(err);
          should.ok(err.hasOwnProperty("missingFields"), "err should set missingFields");
          err["missingFields"].should.eql(["institution"]);
          done();
        });
      });
    });
  });
  
});

