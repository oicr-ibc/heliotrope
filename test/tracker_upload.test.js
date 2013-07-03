require.extensions['.testjs'] = require.extensions['.js'];

var fs = require('fs'),
    path = require('path'),
    mongo = require("mongodb"),
    MongoClient = mongo.MongoClient,
    tracker = require("../lib/trackerImplementation"),
    should = require('should'),
    Gently = require('gently'),
    initialize = require('./initialize');

// The protocol for a step with an attached file is a little more complex.
// First the files need to be uploaded, and then the step can be closed
// with the response data. The interesting bit happens in the file action.

function getFile(filename) {
  var result = {};
  var stats = fs.statSync(filename);

  result.path = filename;
  result.size = stats.size;
  result.name = path.basename(filename);
  result.type = 'application/octet-stream';
  result.lastModifiedDate = new Date();
  return result;
}

describe('POST /studies/GPS/samples/TST001BIOXPAR1/step/recordResults/files', function() {

  var db;

  beforeEach(function(done) {
    initialize.withDB("tracker", function(idb, ierr, iresult) {
      db = idb;
      done();
    });
  });

  afterEach(function(done) {
    if (db)
      db.close();
    db = undefined;
    done();
  });

  it('should process a VCF file', function(done){

    this.timeout(10000);
    var variantCount = 17;

    var request = {params: {study: "GPS", step: "recordResults", identity: "TST001BIOXPAR1", role: "samples"}, user: {userId: "swatt"}};
    var response = {locals: {config: {baseUrl: "http://localhost:3000", knowledgeUriBase: "/knowledge/api", apikey: 'garblemonkey'}}};
    var form = new Gently;
    var endHandler;
    form.expect(form, 'on', null, function(type, handler) {
      if (type == 'end') {
        endHandler = handler;
      }
    });
    request.form = form;

    setTimeout(function(){
      should.exist(endHandler); 
      var file = getFile(__dirname + '/resources/test_snps_out.vcf');
      request.files = {files: [file]};
      endHandler();
    }, 500);

    var nock = require('nock');
    var i, scopes = [];
    for(i = 0; i < variantCount; i++) {
      scopes.push(nock('http://localhost:3000').post('/knowledge/api/variants').reply(200, "/ok"));
    }

    tracker.postEntityStepFiles(null, db, request, response, function(db, err, result) {
      should.not.exist(err);
      should.exist(result);

      // At this stage, we ought to be able to find a good number of observations.
      db.collection("entities", function(err, entities) {
        entities.find({role: "observations"}).count(function(err, count) {
          should.not.exist(err);
          count.should.equal(variantCount);
          done();
        })
      });
    });
  });
});
