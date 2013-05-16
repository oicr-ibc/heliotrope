require.extensions['.testjs'] = require.extensions['.js'];

var fs = require('fs'),
    mongo = require("mongodb"),
    MongoClient = mongo.MongoClient,
    knowledge = require("../lib/knowledgeImplementation"),
    should = require('should'),
    initialize = require('./initialize');

describe('GET /genes/KRAS', function() {
  it('should retrieve a gene', function(done){
    initialize.withDB("heliotrope", function(db, err) {
      
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
});

describe('GET /genes/XXXXX', function() {
  it('should fail to retrieve a gene', function(done){
    initialize.withDB("heliotrope", function(db, err) {
      
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

describe('GET /queries/frequencies', function() {
  it('should retrieve a set of gene frequencies', function(done){
    initialize.withDB("heliotrope", function(db, err) {
      
      var request = {params: {query: "frequencies"}};
      var response = {locals: {passthrough: "value"}};
      knowledge.executeQuery(null, db, request, response, function(db, err, result, res) {
        db.close();

        should.not.exist(err);
        result.data[0].name.should.equal('TTN');
        result.data[1].name.should.equal('JAK2');
        result.data[2].name.should.equal('TP53');

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });
});

describe('GET /variants/KRAS+p.G12D', function() {
  it('should retrieve a variant', function(done){
    initialize.withDB("heliotrope", function(db, err) {
      
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
});

describe('GET /variants/KRAS+p.Gly12Asp', function() {
  it('should retrieve a variant', function(done){
    initialize.withDB("heliotrope", function(db, err) {
      
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


