require.extensions['.testjs'] = require.extensions['.js'];

var fs = require('fs'),
    mongo = require("mongodb"),
    MongoClient = mongo.MongoClient,
    tracker = require("../lib/trackerImplementation"),
    should = require('should'),
    initialize = require('./initialize');


describe('annotateEntity', function() {
  it('should handle an empty query list', function(done){
    initialize.withDB("tracker", function(db, err, result) {
      var object = {};
      
      tracker.annotateEntity(db, object, [], function(o) {
        db.close();
        
        object.hasOwnProperty('count').should.be.false;
        done();
      });
    });
  });

  it('should be able to add a basic query', function(done){
    initialize.withDB("tracker", function(db, err, result) {
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
  });

  it('should be able to add a counting query', function(done){
    initialize.withDB("tracker", function(db, err, result) {
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
  });

  it('should be able to use an aggregation pipeline', function(done){
    initialize.withDB("tracker", function(db, err, result) {
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
  });

  it('should be able to handle multiple queries', function(done){
    initialize.withDB("tracker", function(db, err, result) {
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
  });

})

describe('findStepUpdater', function() {
  
  it('should build an simple updater', function(done){
    initialize.withDB("tracker", function(db, err, result) {

      initialize.withStudy(db, "GPS", function(err, study) {

        var step = {
            name: 'participant',
            stepOptions: { method: 'CreateEntity' },
            fields: { 
              identifier: { 
                type: 'String',
                required: true,
                identity: true },
              institution:  { 
                type: 'String',
                range: ["London", "Hamilton", "Europa"],
                required: true }}};

        var fields = { identifier: { value: 'TST-002' }, institution: { value: 'London' } };
        
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
  });
  
  it('should report a missing field', function(done){
    initialize.withDB("tracker", function(db, err, result) {
      
      initialize.withStudy(db, "GPS", function(err, study) {

        var step = {
            name: 'participant',
            stepOptions: { method: 'CreateEntity' },
            fields: { 
              identifier: { 
                type: 'String',
                required: true,
                identity: true },
              institution:  { 
                type: 'String',
                range: ["London", "Hamilton", "Europa"],
                required: true }}};
        var fields = { identifier: { value: 'TST-002' } };
        
        tracker.findStepUpdater(db, study._id, step, fields, {}, {"$set" : {"steps.$.fields" : []}}, function(db, err, updater) {
          db.close();
          
          should.exist(err);
          should.ok(err.hasOwnProperty("missingFields"), "err should set missingFields");
          err["missingFields"].should.eql(["institution"]);
          updater["$set"]["steps.$.fields"][0]["identity"].should.equal("TST-002");
          updater["$set"]["steps.$.fields"][0]["key"].should.equal("identifier");
          done();
        });
      });
    });
  });
  
  // it('should build an updater for a reference', function(done){
  //   initialize.withDB("tracker", function(db, err, result) {
      
  //     initialize.withStudy(db, "GPS", function(err, study) {

  //       var step = {
  //           name: 'sample',
  //           stepOptions: { method: 'CreateEntity' },
  //           fields: { 
  //             identifier: { 
  //               type: 'String',
  //               required: true,
  //               identity: true },
  //             participantEntityRef:  { 
  //               type: 'Reference',
  //               entity : "participants",
  //               required: true }}};
  //       var fields = { identifier: { value: 'TST001BIOXPAR3' }, participantEntityRef: { value : "TST-001" } };
        
  //       tracker.findStepUpdater(db, study._id, step, fields, {}, {"$set" : {"steps.$.fields" : []}}, function(db, err, updater) {
  //         db.close();
          
  //         should.not.exist(err);
  //         updater["$set"]["steps.$.fields"][0]["identity"].should.equal("TST001BIOXPAR3");
  //         updater["$set"]["steps.$.fields"][0]["key"].should.equal("identifier");
  //         updater["$set"]["steps.$.fields"][1]["key"].should.equal("participantEntityRef");
  //         should.ok(updater["$set"]["steps.$.fields"][1].hasOwnProperty("ref"));
  //         updater["$set"]["steps.$.fields"][1]["ref"]._bsontype.should.equal("ObjectID");
  //         done();
  //       });
  //     });
  //   });  
  // });
});

