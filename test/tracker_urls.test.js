require.extensions['.testjs'] = require.extensions['.js'];

var fs = require('fs'),
    mongo = require("mongodb"),
    MongoClient = mongo.MongoClient,
    tracker = require("../lib/tracker"),
    should = require('should'),
    initialize = require('./initialize');

describe('GET /studies/GPS', function() {
  it('should retrieve a study', function(done){
    initialize.withDB("tracker", function(db, err, result) {
      db.close();
      
      var request = {params: {study: "GPS"}};
      tracker.getStudy(null, db, request, function(db, err, result) {
        db.close();
        
        should.not.exist(err);
        result.data.name.should.equal("GPS");
        result.data.url.should.equal("/studies/GPS");
        done();
      });
    });
  });
});

describe('GET /studies/GPS/participants', function() {
  it('should retrieve a list of participants', function(done){
    initialize.withDB("tracker", function(db, err, result) {
      db.close();
    
      var request = {params: {study: "GPS", role: "participants"}};
      tracker.getEntities(null, db, request, function(db, err, result) {
        db.close();
        
        should.not.exist(err);
        result.data.length.should.equal(1);
        result.data[0].identity.should.equal("TST-001");
        done();
      });
    });
  });
});

describe('GET /studies/GPS/samples', function() {
  it('should retrieve a list of samples', function(done){
    initialize.withDB("tracker", function(db, err, result) {
      db.close();
      
      var request = {params: {study: "GPS", role: "samples"}};
      tracker.getEntities(null, db, request, function(db, err, result) {
        db.close();
        
        should.not.exist(err);
        result.data.length.should.equal(2);
        result.data[0].identity.should.equal("TST001BIOXPAR1");
        result.data[1].identity.should.equal("TST001BIOXPAR2");
        done()
      });
    });
  });
});

describe('GET /studies/GPS/observations', function() {
  it('should retrieve a list of observations', function(done){
    initialize.withDB("tracker", function(db, err, result) {
      
      var request = {params: {study: "GPS", role: "observations"}};
      tracker.getEntities(null, db, request, function(db, err, result) {
        db.close();
        
        should.not.exist(err);
        result.data.length.should.equal(1);
        result.data[0].name.should.equal("KRAS p.Gly12Asp");
        done()
      });
    });
  });
});


describe('GET /studies/GPS/participants/TST-001', function() {
  it('should retrieve a single identified participant', function(done){
    initialize.withDB("tracker", function(db, err, result) {
      
      var request = {params: {study: "GPS", role: "participants", identity: "TST-001"}};
      tracker.getEntity(null, db, request, function(db, err, result) {
        db.close();
        
        should.not.exist(err);
        result.data.identity.should.equal("TST-001");
        result.data.url.should.equal("/studies/GPS/participants/TST-001");
        result.data.role.should.equal("participants");
        done();
      });
    });
  });
});

describe('GET /studies/GPS/participants/TST-001/step/consent', function() {
  it('should retrieve a single identified step', function(done){
    initialize.withDB("tracker", function(db, err, result) {
      
      var request = {params: {study: "GPS", role: "participants", identity: "TST-001", step: "consent"}};
      tracker.getEntityStep(null, db, request, function(db, err, result) {
        db.close();
        
        result.data.identity.should.equal("TST-001");
        result.data.url.should.equal("/studies/GPS/participants/TST-001");
        result.data.step.name.should.equal("consent");
        result.data.step.label.should.equal("Consent");
        result.data.step.fields.consentDate.controlType.should.equal("date");
        result.data.step.fields.consentDate.type.should.equal("Date");
        result.data.step.fields.consentDate.label.should.equal("Consent date");
        result.data.step.fields.consentDate.value.should.equal("2012-11-13T18:45:00.000");
        done();
      });
    });
  });
});

describe('GET /studies/GPS/samples/TST001BIOXPAR1', function() {
  it('should retrieve a single identified sample', function(done){
    initialize.withDB("tracker", function(db, err, result) {
      
      var request = {params: {study: "GPS", role: "samples", identity: "TST001BIOXPAR1"}};
      tracker.getEntity(null, db, request, function(db, err, result) {
        db.close();

        should.not.exist(err);
        should.exist(result.data);
        result.data.identity.should.equal("TST001BIOXPAR1");
        result.data.url.should.equal("/studies/GPS/samples/TST001BIOXPAR1");
        result.data.role.should.equal("samples");
        
        // Check we get related objects. This is especially useful for linking.
        should.exist(result.data.related);
        should.exist(result.data.related.participants);
        should.exist(result.data.related.observations);
        result.data.related.participants.length.should.equal(1);
        result.data.related.participants[0].role.should.equal("participants");
        result.data.related.participants[0].identity.should.equal("TST-001");
        result.data.related.observations.length.should.equal(1);
        result.data.related.observations[0].role.should.equal("observations");
        result.data.related.observations[0].name.should.equal("KRAS p.Gly12Asp");
        
        done();
      });
    });
  });
});

describe('GET /studies/GPS/samples/TST001BIOXPAR1/step/assessSample', function() {
  it('should retrieve a single identified step', function(done){
    initialize.withDB("tracker", function(db, err, result) {
      
      var request = {params: {study: "GPS", role: "samples", identity: "TST001BIOXPAR1", step: "assessSample"}};
      tracker.getEntityStep(null, db, request, function(db, err, result) {
        db.close();
        
        should.not.exist(err);
        result.data.identity.should.equal("TST001BIOXPAR1");
        result.data.url.should.equal("/studies/GPS/samples/TST001BIOXPAR1");
        result.data.step.name.should.equal("assessSample");
        done();
      });
    });
  });
});

describe('POST /studies/GPS/participants/TST-001/step/consent', function() {
  it('should write a date field successfully', function(done){
    initialize.withDB("tracker", function(db, err, result) {
      
      var request = {
        "params": {"study": "GPS", "role": "participants", "identity": "TST-001", "step": "consent"},
        "body": {"data": {"step": {"fields": {"consentDate": {"value": "2013-04-17T00:00:00.000"}}}}}
      }
      
      tracker.postEntityStep(null, db, request, function(db, err, result) {
        db.close();
        
        should.not.exist(err);
        result.should.equal("/studies/GPS/participants/TST-001/step/consent");
        done();
      });
    });
  });
});


describe('POST /studies/GPS/participants/TST-001/step/participant', function() {
  it('should write an identifier field successfully', function(done){
    initialize.withDB("tracker", function(db, err, result) {
      
      var request = {
        "params": {"study": "GPS", "role": "participants", "identity": "id;new", "step": "participant"},
        "body": {"data": {"step": {"fields": {"identifier": {"value": "TST-002"}, "institution" : {"value" : "London"}}}}}
      }
      
      tracker.postEntityStep(null, db, request, function(db, err, result) {
        db.close();
        
        should.not.exist(err);
        result.should.equal("/studies/GPS/participants/TST-002/step/participant");
        done();
      });
    });
  });

  it('should report a missing field appropriately', function(done){
    initialize.withDB("tracker", function(db, err, result) {
      
      var request = {
        "params": {"study": "GPS", "role": "participants", "identity": "id;new", "step": "participant"},
        "body": {"data": {"step": {"fields": {"identifier": {"value": "TST-002"}}}}}
      }
      
      tracker.postEntityStep(null, db, request, function(db, err, result) {
        db.close();
        
        should.exist(err);
        err.err.should.match(/missing fields/);
        err.err.should.match(/institution/);
        done();
      });
    });
  });

  it('should report a duplicate key appropriately', function(done){
    initialize.withDB("tracker", function(db, err, result) {
      
      var request = {
        "params": {"study": "GPS", "role": "participants", "identity": "id;new", "step": "participant"},
        "body": {"data": {"step": {"fields": {"identifier": {"value": "TST-001"}, "institution" : {"value" : "London"}}}}}
      }
      
      tracker.postEntityStep(null, db, request, function(db, err, result) {
        db.close();
        
        should.exist(err);
        err.code.should.equal(11000);
        err.err.should.match(/duplicate key error/);
        done();
      });
    });
  });
});

describe('POST /studies/GPS/samples/TST001BIOXPAR1/step/assessSample', function() {
  it('should update a sample appropriately', function(done){
    initialize.withDB("tracker", function(db, err, result) {
      
      var request = {
        "params": {"study": "GPS", "role": "samples", "identity": "TST001BIOXPAR1", "step": "assessSample"},
        "body": {"data": {"step": {"fields": {"dnaConcentration": {"value": "100"}, "dnaQuality" : {"value" : "Moderate"}}}}}
      }
      
      tracker.postEntityStep(null, db, request, function(db, err, result) {
        db.close();
        should.not.exist(err);
        result.should.equal("/studies/GPS/samples/TST001BIOXPAR1/step/assessSample");
        done();
      });
    });
  });
});

describe('POST /studies/GPS/samples/id;new/step/sample', function() {
  it('should report a missing field appropriately', function(done){
    initialize.withDB("tracker", function(db, err, result) {
      
      var request = {
        "params": {"study": "GPS", "role": "samples", "identity": "id;new", "step": "sample"},
        "body": {"data": {"step": {"fields": {"identifier": {"value": "TST001BIOXPAR3"}}}}}
      }
      
      tracker.postEntityStep(null, db, request, function(db, err, result) {
        db.close();
        
        should.exist(err);
        err.err.should.match(/missing fields/);
        done();
      });
    });
  });

  // it('should create a new sample correctly', function(done){
  //   initialize.withDB("tracker", function(db, err, result) {
      
  //     var request = {
  //       "params": {"study": "GPS", "role": "samples", "identity": "id;new", "step": "sample"},
  //       "body": {"data": {"step": {"fields": {
  //         "identifier": {"value": "TST001BIOXPAR3"}, 
  //         "type" : {"value" : "FFPE"},
  //         "requiresCollection" : {"value" : "false"},
  //         "participantEntityRef" : {"value" : "TST-001"}
  //       }}}}
  //     }
  //     tracker.postEntityStep(null, db, request, function(db, err, result) {
  //       db.close();

  //       console.log("XXX", err, result);
        
  //       should.not.exist(err);
  //       result.should.equal("/studies/GPS/samples/TST001BIOXPAR3/step/sample");
  //       done();
  //     });
  //   });
  // });
  
});

