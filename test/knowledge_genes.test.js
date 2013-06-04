require.extensions['.testjs'] = require.extensions['.js'];

var fs = require('fs'),
    mongo = require("mongodb"),
    MongoClient = mongo.MongoClient,
    knowledge = require("../lib/knowledgeImplementation"),
    should = require('should'),
    initialize = require('./initialize');

describe('GET request', function() {

  var db;

  beforeEach(function(done){
    initialize.withDB("heliotrope", function(idb, ierr, iresult) {
      db = idb;
      done();
    });
  });

  describe('/genes/KRAS', function() {
    it('should retrieve a gene', function(done){
      
      var request = {params: {gene: "KRAS"}};
      var response = {locals: {passthrough: "value"}};
      knowledge.getGene(null, db, request, response, function(db, err, result, res) {
        db.close();

        should.not.exist(err);
        result.data.name.should.equal("KRAS");
        result.data.url.should.equal("/genes/KRAS");

        result.data.sections.mutations.data[0].name.should.equal('p.Gly12Asp');
        result.data.sections.mutations.data[0].url.should.equal('/variants/KRAS%20p.G12D');

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });

  describe('/genes/XXXXX', function() {
    it('should fail to retrieve a gene', function(done){
      
      var request = {params: {gene: "XXXXX"}};
      var response = {locals: {passthrough: "value"}};
      knowledge.getGene(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        should.exist(err);

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });
});


