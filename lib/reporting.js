/*
 * Bridging to Apache FOP and reporting goodness. This allows a subset of HTML to be 
 * transformed into a PDF stream that we can send back to the client. It's a pain having
 * to do this in Java, but we should have an API that means it can be swapped for something
 * a little more sophisticated at some later stage. 
 *
 * This was a good bit easier in Grails, where we could manage the dependencies so
 * much better.
 */

var fs = require('fs'),
    glob = require('glob'),
    spawn = require('child_process').spawn;

var file = "/Users/swatt/git/heliotrope/report.xml";

function fopClasspath(lib, callback) {
  glob(lib + "/fop/*.jar", callback);
}

function generatePdf(file) {
	var lib = fs.realpathSync(__dirname + "/../etc");
	var jarfile = lib + "/fop.jar";
	fopClasspath(lib, function(err, files) {
		files.push(jarfile);
		var classpath = files.join(":");
		var commandOptions = ['-Xmx512M', '-Djava.awt.headless=true', '-classpath', classpath, 'org.apache.fop.cli.Main'];
		commandOptions.push('-xml', file);
		commandOptions.push('-out', 'application/pdf', 'out.pdf');
		commandOptions.push('-xsl', lib + "/fop.xsl");
		console.log(commandOptions);
	  var prc = spawn('java',  commandOptions);

	  prc.stdout.setEncoding('utf8');
	  prc.stdout.on('data', function (data) {
	    var str = data.toString()
	    var lines = str.split(/(\r?\n)/g);
	    console.log(lines.join(""));
	  });
	  prc.stdout.setEncoding('utf8');
	  prc.stderr.on('data', function (data) {
	    var str = data.toString()
	    var lines = str.split(/(\r?\n)/g);
	    console.error(lines.join(""));
	  });

	  prc.on('close', function (code) {
	    console.log('process exit code ' + code);
    });
	})
}

generatePdf(file);