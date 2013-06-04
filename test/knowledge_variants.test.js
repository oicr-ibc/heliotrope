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

  describe('/variants/KRAS+p.G12D', function() {
    it('should retrieve a variant', function(done){
      
      var request = {params: {id: "KRAS p.G12D"}};
      var response = {locals: {passthrough: "value"}};
      knowledge.getVariant(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        should.not.exist(err);
        result.data.gene.should.equal("KRAS");
        result.data.name.should.equal("KRAS p.Gly12Asp");
        result.data.geneId.should.equal("ENSG00000133703");
        result.data.url.should.equal('/variants/KRAS%20p.G12D');

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });

  describe('/variants/KRAS+p.Gly12Asp', function() {
    it('should retrieve a variant', function(done){
      
      var request = {params: {id: "KRAS p.Gly12Asp"}};
      var response = {locals: {passthrough: "value"}};
      knowledge.getVariant(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        should.not.exist(err);
        result.data.gene.should.equal("KRAS");
        result.data.name.should.equal("KRAS p.Gly12Asp");
        result.data.geneId.should.equal("ENSG00000133703");
        result.data.url.should.equal('/variants/KRAS%20p.G12D');

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });
});


