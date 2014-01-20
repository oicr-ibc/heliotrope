/*
 * Bridging to Apache FOP and reporting goodness. This allows a subset of HTML to be 
 * transformed into a PDF stream that we can send back to the client. It's a pain having
 * to do this in Java, but we should have an API that means it can be swapped for something
 * a little more sophisticated at some later stage. 
 *
 * This was a good bit easier in Grails, where we could manage the dependencies so
 * much better.
 */

module.exports.log4js = module.parent.exports.log4js;
module.exports.logger = module.parent.exports.logger;

var fs = require('fs'),
    glob = require('glob'),
    spawn = require('child_process').spawn;

var logger = module.exports.logger;

function fopClasspath(lib, callback) {
  glob(lib + "/fop/*.jar", callback);
}

// Note that this does depend on Java, and on having headless support. This is not
// totally trivial, but there is nothing in node.js capable of building that kind of
// PDF generation yet. PDFs can be generated, but it is basically code at a much lower
// level. This is a standard mechanism (XSL-FO) that can be maintained and adapted
// more easily. 

function generatePdf(filename, callback) {
	var lib = fs.realpathSync(__dirname + "/../etc");
	var jarfile = lib + "/fop.jar";
	fopClasspath(lib, function(err, files) {
		files.push(jarfile);
		var classpath = files.join(":");
		var commandOptions = ['-Xmx512M', '-Djava.awt.headless=true', '-classpath', classpath, 'org.apache.fop.cli.Main'];
		commandOptions.push('-xml', filename);
		commandOptions.push('-pdf', '-');
		commandOptions.push('-xsl', lib + "/fop.xsl");

		logger.info("Executing: " + "java" + " " + commandOptions.join(" "));

	  var prc = spawn('java',  commandOptions);

	  prc.stderr.on('data', function (data) {
	    process.stderr.write(data.toString());
	  });

	  prc.on('close', function (code) {
	    if (code !== 0) {
	    	return callback(code, null);
	    }
    });

    return callback(null, prc.stdout);
	})
}

module.exports.generatePdf = generatePdf;

// var input = fs.createReadStream('report.xml', {'flags' : 'r'});
// generatePdf(input, function(err, stream) {
// 	stream.pipe(fs.createWriteStream('output4.pdf', {'flags' : 'w'}));
// });