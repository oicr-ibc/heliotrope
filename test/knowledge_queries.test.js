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

  describe('/queries/frequencies', function() {
    it('should retrieve a set of gene frequencies', function(done){
      
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


