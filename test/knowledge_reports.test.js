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

  // Used to get the data for a report. In practice, express will
  // render this using jade. By far the most interesting bit is the
  // chart data, which will be an SVG string by the time we get here. 

  describe('/variants/KRAS+p.G12D/report', function() {
    it('should get the report data', function(done){
      
      var request = {params: {id: "KRAS p.G12D"}};
      var response = {locals: {passthrough: "value"}};
      knowledge.getVariantReport(null, db, request, response, function(db, err, result, res) {
        db.close();
        
        should.not.exist(err);
        should.exist(result);
        should.exist(result.data);
        should.exist(result.data.chart);
        should.exist(result.data.genesRefx);
        should.exist(result.data.genesRefx._body);

        done();
      });
    });
  });
});