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

  beforeEach(function(done){
    initialize.withDB("tracker", function(idb, ierr, iresult) {
      db = idb;
      done();
    });
  });

  describe('/studies/GPS', function() {
    it('should retrieve a study', function(done){
      db.close();
      
      var request = {params: {study: "GPS"}};
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

  describe('/studies/GPS/participants', function() {
    it('should retrieve a list of participants', function(done){
      db.close();
    
      var request = {params: {study: "GPS", role: "participants"}};
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

  describe('/studies/GPS/samples', function() {
    it('should retrieve a list of samples', function(done){
      db.close();
      
      var request = {params: {study: "GPS", role: "samples"}};
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
      
      var request = {params: {study: "GPS", role: "observations"}};
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
      
      var request = {params: {study: "GPS", role: "participants", identity: "TST-001"}};
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

  describe('/studies/GPS/participants/TST-001/step/consent', function() {
    it('should retrieve a single identified step', function(done){
      
      var request = {params: {study: "GPS", role: "participants", identity: "TST-001", step: "consent"}};
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

  describe('/studies/GPS/samples/TST001BIOXPAR1', function() {
    it('should retrieve a single identified sample', function(done){
      
      var request = {params: {study: "GPS", role: "samples", identity: "TST001BIOXPAR1"}};
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
      
      var request = {params: {study: "GPS", role: "samples", identity: "TST001BIOXPAR1", step: "assessSample"}};
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
        query: {participantEntityRef: "TST-001"}
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

});






