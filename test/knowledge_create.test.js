require.extensions['.testjs'] = require.extensions['.js'];

var fs = require('fs'),
    mongo = require("mongodb"),
    MongoClient = mongo.MongoClient,
    knowledge = require("../lib/knowledgeImplementation"),
    should = require('should'),
    initialize = require('./initialize');

describe('POST request', function() {

  var db;

  beforeEach(function(done){
    initialize.withDB("heliotrope", function(idb, ierr, iresult) {
      db = idb;
      done();
    });
  });

  describe('/variants', function() {
    it('should create a new variant', function(done){

      var request = {
        "body" : {
          "data" : [{
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
            "HGVSc"              : "c.3622G>T"
          }]
        }
      }
      
      var response = {locals: {passthrough: "value"}};
      knowledge.postVariants(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        should.not.exist(err);

        res.locals.passthrough.should.equal("value");
        done();
      });
    });
  });
});


