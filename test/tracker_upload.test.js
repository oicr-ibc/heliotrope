require.extensions['.testjs'] = require.extensions['.js'];

var fs = require('fs'),
    path = require('path'),
    mongo = require("mongodb"),
    MongoClient = mongo.MongoClient,
    tracker = require("../lib/tracker"),
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
}

describe('POST /studies/GPS/samples/TST001BIOXPAR1/step/recordResults/files', function() {
  it('should process a VCF file', function(done){

    initialize.withDB("tracker", function(db, err, result) {
      
      var request = {params: {study: "GPS"}};
      var form = new Gently;
      var endHandler;
      var response;
      form.expect(form, 'on', null, function(type, handler) {
        if (type == 'end') {
          endHandler = handler;
        }
      });
      request.form = form;

      setTimeout(function(){
        should.exist(endHandler); 
        console.log("In timeout");
        request.files = {};
        var file = {};
        request.files.files = [file];
        endHandler();
        should.not.exist(err);
        done();
      }, 1000);

      tracker.postEntityStepFiles(null, db, request, function(db, err, result) {
        db.close();
        console.log("XXX", err, result);
        response = {err: err, result: result};
      });
    });
  });
});
