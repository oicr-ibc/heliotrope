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

  describe('/studies', function() {
    it('should retrieve a list of studies', function(done) {
      db.close();
      
      var request = {params: {}, "user": {"userId": "swatt"}};
      var response = {locals: {passthrough: "value"}};
      tracker.getStudies(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        should.not.exist(err);
        should.exist(result);
        should.exist(result.data);
        should.exist(result.data[0]);
        result.data[0].name.should.equal('GPS')
        result.data[0].statistics["participants"].count.should.equal(1)
        result.data[0].statistics["samples"].count.should.equal(2)
        result.data[0].statistics["observations"].count.should.equal(1)
        should.exist(result.data[0].lastModified);

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });

  describe('/studies/GPS', function() {
    it('should retrieve a study', function(done) {
      db.close();
      
      var request = {params: {study: "GPS"}, "user": {"userId": "swatt"}};
      var response = {locals: {passthrough: "value"}};
      tracker.getStudy(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        should.not.exist(err);
        result.data.name.should.equal("GPS");
        result.data.url.should.equal("/studies/GPS");

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });

  describe('/studies/GPS', function() {
    it('should fail to retrieve a study for a disallowed user', function(done) {
      db.close();
      
      var request = {params: {study: "GPS"}, "user": {"userId": "mungo"}};
      var response = {locals: {passthrough: "value"}};
      tracker.getStudy(null, db, request, response, function(db, err, result, res) {
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

  describe('/studies/GPS/participants', function() {
    it('should retrieve a list of participants', function(done){
      db.close();
    
      var request = {params: {study: "GPS", role: "participants"}, "user": {"userId": "swatt"}};
      var response = {locals: {passthrough: "value"}};
      tracker.getEntities(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        should.not.exist(err);
        result.data.length.should.equal(1);
        result.data[0].identity.should.equal("TST-001");

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  }); 

  describe('/studies/GPS/participants', function() {
    it('should fail to retrieve a list of participants for a disallowed user', function(done){
      db.close();
    
      var request = {params: {study: "GPS", role: "participants"}, "user": {"userId": "mungo"}};
      var response = {locals: {passthrough: "value"}};
      tracker.getEntities(null, db, request, response, function(db, err, result, res) {
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

  describe('/studies/GPS/samples', function() {
    it('should retrieve a list of samples', function(done){
      db.close();
      
      var request = {params: {study: "GPS", role: "samples"}, "user": {"userId": "swatt"}};
      var response = {locals: {passthrough: "value"}};
      tracker.getEntities(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        should.not.exist(err);
        result.data.length.should.equal(2);
        result.data[0].identity.should.equal("TST001BIOXPAR1");
        result.data[1].identity.should.equal("TST001BIOXPAR2");

        res.locals.passthrough.should.equal("value");
        done()
      });
    });
  });

  describe('/studies/GPS/observations', function() {
    it('should retrieve a list of observations', function(done){
      
      var request = {params: {study: "GPS", role: "observations"}, "user": {"userId": "swatt"}};
      var response = {locals: {passthrough: "value"}};
      tracker.getEntities(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        should.not.exist(err);
        result.data.length.should.equal(1);
        result.data[0].name.should.equal("KRAS p.Gly12Asp");

        res.locals.passthrough.should.equal("value");
        done()
      });
    });
  });

  describe('/studies/GPS/participants/TST-001', function() {
    it('should retrieve a single identified participant', function(done){
      
      var request = {params: {study: "GPS", role: "participants", identity: "TST-001"}, "user": {"userId": "swatt"}};
      var response = {locals: {passthrough: "value"}};
      tracker.getEntity(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        should.not.exist(err);
        result.data.identity.should.equal("TST-001");
        result.data.url.should.equal("/studies/GPS/participants/TST-001");
        result.data.role.should.equal("participants");

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });

  describe('/studies/GPS/participants/TST-001', function() {
    it('should fail to retrieve a single identified participant for a disallowed user', function(done){
      
      var request = {params: {study: "GPS", role: "participants", identity: "TST-001"}, "user": {"userId": "mungo"}};
      var response = {locals: {passthrough: "value"}};
      tracker.getEntity(null, db, request, response, function(db, err, result, res) {
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

  describe('/studies/GPS/participants/TST-001', function() {
    it('should return steps correctly', function(done){
      
      var request = {params: {study: "GPS", role: "participants", identity: "TST-001"}, "user": {"userId": "swatt"}};
      var response = {locals: {passthrough: "value"}};
      tracker.getEntity(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        should.exist(result.data.steps);
        result.data.steps.every(function(step) {
          should.exist(step.id);
          should.exist(step.stepRef);
          should.exist(step.stepDate);
          should.exist(step.url);
        })

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });

  // When we have a user blocked access to a single step, the values for that step should not be 
  // available. 
  describe('/studies/GPS/participants/TST-001', function() {
    it('should retrieve a filtered single identified participant for partially-authorized user', function(done){

      var request = {params: {study: "GPS", role: "participants", identity: "TST-001"}, "user": {"userId": "acavender"}};
      var response = {locals: {passthrough: "value"}};
      tracker.getEntity(null, db, request, response, function(db, err, result, res) {
        db.close();

        should.not.exist(err);
        result.data.identity.should.equal("TST-001");
        result.data.url.should.equal("/studies/GPS/participants/TST-001");
        result.data.role.should.equal("participants");

        // Check the step is missing from the steps array
        should.exist(result.data.steps);
        result.data.steps.some(function(step) {
          return step.fields && step.fields.some(function(field) { return field.key === 'biopsyDate'; });
        }).should.equal(false);

        // But check that there are a decent number of steps visible
        result.data.steps.length.should.be.above(3);

        // Check the fields are missing from the values table
        should.not.exist(result.data.values["biopsyDate"]);
        should.not.exist(result.data.values["biopsyCores"]);

        // To be safe, check that other fields do exist. 
        should.exist(result.data.values["consentDate"]);
        should.exist(result.data.values["pathologyDate"]);

        done();
      });
    });
  });

  describe('/studies/GPS/participants/TST-001/step/consent', function() {
    it('should retrieve a single identified step', function(done){
      
      var request = {params: {study: "GPS", role: "participants", identity: "TST-001", step: "consent"}, "user": {"userId": "swatt"}};
      var response = {locals: {passthrough: "value"}};
      tracker.getEntityStep(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        result.data.identity.should.equal("TST-001");
        result.data.url.should.equal("/studies/GPS/participants/TST-001");
        result.data.step.name.should.equal("consent");
        result.data.step.label.should.equal("Consent");
        result.data.step.fields.consentDate.controlType.should.equal("date");
        result.data.step.fields.consentDate.type.should.equal("Date");
        result.data.step.fields.consentDate.label.should.equal("Consent date");
        result.data.step.fields.consentDate.value.should.equal("2012-11-13T18:45:00.000");

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });

  describe('/studies/GPS/participants/TST-001/step/consent', function() {
    it('should fail to retrieve a single identified step for a disallowed user', function(done){
      
      var request = {params: {study: "GPS", role: "participants", identity: "TST-001", step: "consent"}, "user": {"userId": "mungo"}};
      var response = {locals: {passthrough: "value"}};
      tracker.getEntityStep(null, db, request, response, function(db, err, result, res) {
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

  // There are two different biopsy steps. They both ought to be accessible
  // with the additional identifier. 
  describe('/studies/GPS/participants/TST-001/step/biopsy;511d2295ea2a8c2f1e2c1ff2', function() {
    it('should retrieve a single identified step', function(done){
      
      var request = {params: {study: "GPS", role: "participants", identity: "TST-001", step: "biopsy;511d2295ea2a8c2f1e2c1ff2"}, "user": {"userId": "swatt"}};
      var response = {locals: {passthrough: "value"}};
      tracker.getEntityStep(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        result.data.identity.should.equal("TST-001");
        result.data.url.should.equal("/studies/GPS/participants/TST-001");
        result.data.step.name.should.equal("biopsy");
        result.data.step.label.should.equal("Biopsy");
        result.data.step.fields.biopsyDate.controlType.should.equal("date");
        result.data.step.fields.biopsyDate.type.should.equal("Date");
        result.data.step.fields.biopsyDate.label.should.equal("Biopsy date");
        result.data.step.fields.biopsyDate.value.should.equal("2012-11-14T14:12:00.000");

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });

  // There are two different biopsy steps. They both ought to be accessible
  // with the additional identifier. 
  describe('/studies/GPS/participants/TST-001/step/biopsy;51a4e3d99be0f733f234e6a4', function() {
    it('should retrieve a single identified step', function(done){
      
      var request = {params: {study: "GPS", role: "participants", identity: "TST-001", step: "biopsy;51a4e3d99be0f733f234e6a4"}, "user": {"userId": "swatt"}};
      var response = {locals: {passthrough: "value"}};
      tracker.getEntityStep(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        result.data.identity.should.equal("TST-001");
        result.data.url.should.equal("/studies/GPS/participants/TST-001");
        result.data.step.name.should.equal("biopsy");
        result.data.step.label.should.equal("Biopsy");
        result.data.step.fields.biopsyDate.controlType.should.equal("date");
        result.data.step.fields.biopsyDate.type.should.equal("Date");
        result.data.step.fields.biopsyDate.label.should.equal("Biopsy date");
        result.data.step.fields.biopsyDate.value.should.equal("2012-11-19T18:26:00.000");

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });

  describe('/studies/GPS/samples/TST001BIOXPAR1', function() {
    it('should retrieve a single identified sample', function(done){
      
      var request = {params: {study: "GPS", role: "samples", identity: "TST001BIOXPAR1"}, "user": {"userId": "swatt"}};
      var response = {locals: {passthrough: "value"}};
      tracker.getEntity(null, db, request, response, function(db, err, result, res) {
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
        
        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });

  describe('/studies/GPS/samples/TST001BIOXPAR1/step/assessSample', function() {
    it('should retrieve a single identified step', function(done){
      
      var request = {params: {study: "GPS", role: "samples", identity: "TST001BIOXPAR1", step: "assessSample"}, "user": {"userId": "swatt"}};
      var response = {locals: {passthrough: "value"}};
      tracker.getEntityStep(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        should.not.exist(err);
        result.data.identity.should.equal("TST001BIOXPAR1");
        result.data.url.should.equal("/studies/GPS/samples/TST001BIOXPAR1");
        result.data.step.name.should.equal("assessSample");

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });

  describe('/studies/GPS/samples/id%3Bnew/step/sample?participantEntityRef=TST-001', function() {
    it('should get the initial step format', function(done){
      
      var request = {
        params: {study: "GPS", role: "samples", identity: "id;new", step: "sample"},
        query: {participantEntityRef: "TST-001"},
        "user": {"userId": "swatt"}
      };
      var response = {locals: {passthrough: "value"}};
      tracker.getEntityStep(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        should.not.exist(err);
        should.exist(result);
        should.exist(result.data);
        should.exist(result.data.step);
        should.exist(result.data.step.fields);
        should.exist(result.data.step.fields["participantEntityRef"]);
        should.exist(result.data.step.fields["participantEntityRef"].displayValue);
        result.data.step.fields["participantEntityRef"].displayValue.should.equal("TST-001")

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });


  describe('/related/GPS/participants/TST-001', function() {
    it('should get the list of all related entities for a participant', function(done){

      var request = {
        params: {study: "GPS", role: "participants", identity: "TST-001"}, "user": {"userId": "swatt"}
      };
      var response = {locals: {passthrough: "value"}};
      tracker.getRelatedEntities(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        should.not.exist(err);
        should.exist(result);
        should.exist(result.data);
        result.data.length.should.equal(3);

        res.locals.passthrough.should.equal("value");
        done();
      });

    });
  });

  describe('/related/GPS?_role=participants', function() {
    it('should get the list of all participants for a study', function(done){

      var request = {
        "params": {"study": "GPS"}, 
        "user": {"userId": "swatt"},
        "query": {"_role" : "participants"}
      };
      var response = {locals: {passthrough: "value"}};
      tracker.getStudyRelatedEntities(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        should.not.exist(err);
        should.exist(result);
        should.exist(result.data);
        result.data.length.should.equal(1);

        result.data[0].identity.should.equal("TST-001");

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });

  describe('/related/GPS?_role=samples', function() {
    it('should get the list of all samples for a study', function(done){

      var request = {
        "params": {"study": "GPS"}, 
        "user": {"userId": "swatt"},
        "query": {"_role" : "samples"}
      };
      var response = {locals: {passthrough: "value"}};
      tracker.getStudyRelatedEntities(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        should.not.exist(err);
        should.exist(result);
        should.exist(result.data);
        result.data.length.should.equal(2);

        result.data[0].identity.should.equal("TST001BIOXPAR1");
        result.data[1].identity.should.equal("TST001BIOXPAR2");

        res.locals.passthrough.should.equal("value");
        done();
      });

    });
  });

  describe('/studies/GPS/participants/TST-001/related', function() {
    it('should fail to get the list of all related entities for a participant for a disallowed user', function(done){

      var request = {
        params: {study: "GPS", role: "participants", identity: "TST-001"}, "user": {"userId": "mungo"}
      };
      var response = {locals: {passthrough: "value"}};
      tracker.getRelatedEntities(null, db, request, response, function(db, err, result, res) {
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

  describe('/studies/GPS/participants/TST-001/related?role=samples', function() {
    it('should get the list of samples for a participant', function(done){

      var request = {
        "params": {"study": "GPS", "role": "participants", "identity": "TST-001"},
        "query": {"role": "samples"},
        "user": {"userId": "swatt"}
      };
      var response = {locals: {passthrough: "value"}};
      tracker.getRelatedEntities(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        should.not.exist(err);
        should.exist(result);
        should.exist(result.data);
        result.data.length.should.equal(2);
        result.data.every(function(entity) {
          entity.role.should.equal("samples");
        })

        res.locals.passthrough.should.equal("value");
        done();
      });

    });
  });

  describe('/views/GPS/participants', function() {
    it('should get the list of views for a participant', function(done){

      var request = {
        params: {study: "GPS", role: "participants"}, "user": {"userId": "swatt"}
      };
      var response = {locals: {passthrough: "value"}};
      tracker.getViews(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        should.not.exist(err);
        should.exist(result);
        should.exist(result.data);
        should.exist(result.data.views);
        result.data.views.length.should.equal(6);
        result.data.views[0].name.should.equal('summary')
        should.exist(result.data.views[0].body);

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });

  describe('/views/GPS/participants', function() {
    it('should fail to get the list of views for a participant for a disallowed user', function(done){

      var request = {
        params: {study: "GPS", role: "participants"}, "user": {"userId": "mungo"}
      };
      var response = {locals: {passthrough: "value"}};
      tracker.getViews(null, db, request, response, function(db, err, result, res) {
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

  describe('/views/GPS', function() {
    it('should get the list of views for a participant', function(done){

      var request = {
        params: {study: "GPS"}, "user": {"userId": "swatt"}
      };
      var response = {locals: {passthrough: "value"}};
      tracker.getViews(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        should.not.exist(err);
        should.exist(result);
        should.exist(result.data);
        should.exist(result.data.views["participants"]);
        should.exist(result.data.views["samples"]);
        result.data.views["participants"].length.should.equal(6);
        result.data.views["participants"][0].name.should.equal('summary')
        should.exist(result.data.views["participants"][0].body);

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });

});






