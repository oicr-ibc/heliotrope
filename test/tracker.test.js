var fs = require('fs'),
    mongo = require("mongodb"),
    MongoClient = mongo.MongoClient,
    tracker = require("../lib/tracker"),
    should = require('should');

function withDB(callback) {
  fs.readFile('test/data.jsinit', function (err, data) {
    if (err) throw err;
    MongoClient.connect("mongodb://localhost:27017/tracker", function(err, db) {
      db.eval(data.toString(), [], 
        function(err, result) {
          callback(db, err, result);
      });
    });
  });
}

describe('GET /studies/GPS', function() {
  it('should retrieve a study', function(done){
    withDB(function(db, err, result) {
      db.close();
      
      var request = {params: {study: "GPS"}};
      tracker.getStudy(request, function(db, err, result) {
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
    withDB(function(db, err, result) {
      db.close();
    
      var request = {params: {study: "GPS", role: "participants"}};
      tracker.getEntities(request, function(db, err, result) {
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
    withDB(function(db, err, result) {
      db.close();
      
      var request = {params: {study: "GPS", role: "samples"}};
      tracker.getEntities(request, function(db, err, result) {
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

describe('GET /studies/GPS/participants/TST-001', function() {
  it('should retrieve a single identified participant', function(done){
    withDB(function(db, err, result) {
      db.close();
      
      var request = {params: {study: "GPS", role: "participants", identity: "TST-001"}};
      tracker.getEntity(request, function(db, err, result) {
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
    withDB(function(db, err, result) {
      db.close();
      
      var request = {params: {study: "GPS", role: "participants", identity: "TST-001", step: "consent"}};
      tracker.getEntityStep(request, function(db, err, result) {
      debugger;
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
    withDB(function(db, err, result) {
      db.close();
      
      var request = {params: {study: "GPS", role: "samples", identity: "TST001BIOXPAR1"}};
      tracker.getEntity(request, function(db, err, result) {
        db.close();
        
        should.not.exist(err);
        result.data.identity.should.equal("TST001BIOXPAR1");
        result.data.url.should.equal("/studies/GPS/samples/TST001BIOXPAR1");
        result.data.role.should.equal("samples");
        
        should.exist(result.data.related);
        should.exist(result.data.related.participants);
        should.exist(result.data.related.observations);
        result.data.related.participants.length.should.equal(1);
        result.data.related.participants[0].role.should.equal("participants");
        result.data.related.participants[0].identity.should.equal("TST-001");
        result.data.related.observations.length.should.equal(1);
        result.data.related.observations[0].role.should.equal("observations");
        result.data.related.observations[0].label.should.equal("KRAS p.G12D");
        
        done();
      });
    });
  });
});

describe('GET /studies/GPS/samples/TST001BIOXPAR1/step/assessSample', function() {
  it('should retrieve a single identified step', function(done){
    withDB(function(db, err, result) {
      db.close();
      
      var request = {params: {study: "GPS", role: "samples", identity: "TST001BIOXPAR1", step: "assessSample"}};
      tracker.getEntityStep(request, function(db, err, result) {
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

describe('findStepUpdater', function() {
  
  it('should build an simple updater', function(done){
    withDB(function(db, err, result) {
      
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
      
      tracker.findStepUpdater(db, step, fields, {}, {"$set" : {"steps.$.fields" : []}}, function(db, err, updater) {
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
    withDB(function(db, err, result) {
      
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
      
      tracker.findStepUpdater(db, step, fields, {}, {"$set" : {"steps.$.fields" : []}}, function(db, err, updater) {
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
  
  it('should build an updater for a reference', function(done){
    withDB(function(db, err, result) {
      
      var step = {
          name: 'sample',
          stepOptions: { method: 'CreateEntity' },
          fields: { 
            identifier: { 
              type: 'String',
              required: true,
              identity: true },
            participantEntityRef:  { 
              type: 'Reference',
              entity : "participants",
              required: true }}};
      var fields = { identifier: { value: 'TST001BIOXPAR3' }, participantEntityRef: { value : "TST-001" } };
      
      tracker.findStepUpdater(db, step, fields, {}, {"$set" : {"steps.$.fields" : []}}, function(db, err, updater) {
        db.close();
        
        should.not.exist(err);
        updater["$set"]["steps.$.fields"][0]["identity"].should.equal("TST001BIOXPAR3");
        updater["$set"]["steps.$.fields"][0]["key"].should.equal("identifier");
        updater["$set"]["steps.$.fields"][1]["key"].should.equal("participantEntityRef");
        should.ok(updater["$set"]["steps.$.fields"][1].hasOwnProperty("ref"));
        updater["$set"]["steps.$.fields"][1]["ref"]._bsontype.should.equal("ObjectID");
        done();
      });
    });  
  });
});

describe('POST /studies/GPS/participants/TST-001/step/consent', function() {
  it('should write a date field successfully', function(done){
    withDB(function(db, err, result) {
      db.close();
      
      var request = {
        "params": {"study": "GPS", "role": "participants", "identity": "TST-001", "step": "consent"},
        "body": {"data": {"step": {"fields": {"consentDate": {"value": "2013-04-17T00:00:00.000"}}}}}
      }
      
      tracker.postEntityStep(request, function(db, err, result) {
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
    withDB(function(db, err, result) {
      db.close();
      
      var request = {
        "params": {"study": "GPS", "role": "participants", "identity": "id;new", "step": "participant"},
        "body": {"data": {"step": {"fields": {"identifier": {"value": "TST-002"}, "institution" : {"value" : "London"}}}}}
      }
      
      tracker.postEntityStep(request, function(db, err, result) {
        db.close();
        
        should.not.exist(err);
        result.should.equal("/studies/GPS/participants/TST-002/step/participant");
        done();
      });
    });
  });

  it('should report a missing field appropriately', function(done){
    withDB(function(db, err, result) {
      db.close();
      
      var request = {
        "params": {"study": "GPS", "role": "participants", "identity": "id;new", "step": "participant"},
        "body": {"data": {"step": {"fields": {"identifier": {"value": "TST-002"}}}}}
      }
      
      tracker.postEntityStep(request, function(db, err, result) {
        db.close();
        
        should.exist(err);
        err.err.should.match(/missing fields/);
        err.err.should.match(/institution/);
        done();
      });
    });
  });

  it('should report a duplicate key appropriately', function(done){
    withDB(function(db, err, result) {
      db.close();
      
      var request = {
        "params": {"study": "GPS", "role": "participants", "identity": "id;new", "step": "participant"},
        "body": {"data": {"step": {"fields": {"identifier": {"value": "TST-001"}, "institution" : {"value" : "London"}}}}}
      }
      
      tracker.postEntityStep(request, function(db, err, result) {
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
    withDB(function(db, err, result) {
      db.close();
      
      var request = {
        "params": {"study": "GPS", "role": "samples", "identity": "TST001BIOXPAR1", "step": "assessSample"},
        "body": {"data": {"step": {"fields": {"dnaConcentration": {"value": "100"}, "dnaQuality" : {"value" : "Moderate"}}}}}
      }
      
      tracker.postEntityStep(request, function(db, err, result) {
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
    withDB(function(db, err, result) {
      db.close();
      
      var request = {
        "params": {"study": "GPS", "role": "samples", "identity": "id;new", "step": "sample"},
        "body": {"data": {"step": {"fields": {"identifier": {"value": "TST001BIOXPAR3"}}}}}
      }
      
      tracker.postEntityStep(request, function(db, err, result) {
        db.close();
        
        should.exist(err);
        err.err.should.match(/missing fields/);
        done();
      });
    });
  });

  it('should create a new sample correctly', function(done){
    withDB(function(db, err, result) {
      db.close();
      
      var request = {
        "params": {"study": "GPS", "role": "samples", "identity": "id;new", "step": "sample"},
        "body": {"data": {"step": {"fields": {
          "identifier": {"value": "TST001BIOXPAR3"}, 
          "type" : {"value" : "FFPE"},
          "requiresCollection" : {"value" : "false"},
          "participantEntityRef" : {"value" : "TST-001"}
        }}}}
      }
      tracker.postEntityStep(request, function(db, err, result) {
        db.close();
        
        should.not.exist(err);
        result.should.equal("/studies/GPS/samples/TST001BIOXPAR3/step/sample");
        done();
      });
    });
  });
});

