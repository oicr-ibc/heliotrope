require.extensions['.testjs'] = require.extensions['.js'];

var fs = require('fs'),
    mongo = require("mongodb"),
    MongoClient = mongo.MongoClient,
    knowledge = require("../lib/knowledgeImplementation"),
    should = require('should'),
    initialize = require('./initialize');

describe('POST request', function() {

  var db, request;
  var newIndex;

  // Create a marker index so we can quickly clean
  before(function(done) {
    initialize.withDB("heliotrope", function(idb, ierr, iresult) {
      idb.ensureIndex("variants", {"sections.positions.data.TESTMARKER" : 1}, function(err, indexName) {
        idb.close();
        newIndex = indexName;
        done();
      });
    });
  });

  // Drop the marker index so we can quickly clean
  after(function(done) {
    initialize.withDB("heliotrope", function(idb, ierr, iresult) {
      idb.dropIndex("variants", newIndex, function(err, result) {
        idb.close();
        done();
      });
    });
  });

  // After each, throw away any test variants
  afterEach(function(done) {
    // Yes, this can be slow unless we ensure we have an index. But we don't need one long term
    db.collection("variants", function(err, variants) {
      variants.remove({"sections.positions.data.TESTMARKER" : "TESTMARKER"}, function(e, r) {
        db.close();
        done();
      });
    });
  });

  beforeEach(function(done) {
    initialize.withDB("heliotrope", function(idb, ierr, iresult) {
      db = idb;

      request = {
        "body" : {
          "data" : {
            "variantType"        : "mutation",
            "consequence"        : "missense_variant",
            "type"               : "variant",
            "gene"               : "NPHS1",
            "geneId"             : "ENSG00000161270",
            "shortMutation"      : "p.D1208Y",
            "mutation"           : "p.Asp1208Tyr",
            "shortName"          : "NPHS1 p.D1208Y",
            "name"               : "NPHS1 p.Asp1208Tyr",

            "transcript"         : "ENST00000378910",
            "chromosome"         : "19",
            "exon"               : "29",
            "cdsPosition"        : "3622",
            "codon"              : "1208",
            "start"              : "36317520",
            "stop"               : "36317520",
            "HGVSc"              : "c.3622G>T",
            "TESTMARKER"         : "TESTMARKER"
          }
        }
      }

      done();
    });
  });

  describe('/variants', function() {

    function testMissingField(field) {
      it('should fail to validate variant with missing field: ' + field, function(done){
        delete request["body"]["data"][field];
        var response = {locals: {passthrough: "value"}};
        knowledge.postVariant(null, db, request, response, function(db, err, result, res) {
          
          should.exist(err);
          err.error.should.match(/missing/i);
          err.error.should.match(/field/i);

          done();
        });
      });
    }

    testMissingField("geneId");
    testMissingField("mutation");
    testMissingField("transcript");
    testMissingField("start");
    testMissingField("stop");

    testMissingField("consequence");
    testMissingField("type");
    testMissingField("gene");

    it('should fail to create an existing variant', function(done){
      var response = {locals: {passthrough: "value"}};
      knowledge.postVariant(null, db, request, response, function(db, err, result, res, status) {
        
        should.exist(err);
        should.exist(status);
        status.should.equal(403);
        err.error.should.match(/duplicate/i);

        done();
      });
    });

    it('should create a novel variant', function(done){
      request["body"]["data"]["mutation"] = "p.Asp1206Tyr";
      delete request["body"]["data"]["shortMutation"];
      delete request["body"]["data"]["name"];
      delete request["body"]["data"]["shortName"];
      var response = {"locals": {"passthrough": "value"}, "config" : {"knowledgeUriBase" : "/"}};
      knowledge.postVariant(null, db, request, response, function(db, err, result, res, status) {
        
        should.not.exist(err);
        should.exist(result);
        result.should.equal("/variants/NPHS1%20p.D1206Y");

        done();
      });
    });
  });
});


