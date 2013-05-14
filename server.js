/* 
    server.js
    mongodb-rest

    Created by Tom de Grunt on 2010-10-03.
    Copyright (c) 2010 Tom de Grunt.
    This file is part of mongodb-rest.
*/ 

var fs = require("fs"),
    util = require('util'),
    express = require('express')
    polyfill = require('./lib/polyfill');

var config = { "db": {
  'port': 27017,
  'host': "localhost"
  },
  'server': {
    'port': 3000,
    'address': "0.0.0.0"
  },
  'flavor': "regular",
  'debug': true
};

var app = module.exports.app = express();

try {
  config = JSON.parse(fs.readFileSync(process.cwd()+"/config.json"));
} catch(e) {
  // ignore
}

module.exports.config = config;

app.configure(function(){
  app.locals.pretty = true;
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/views');
  
  app.use(express.bodyParser({
    keepExtensions: true,
    limit: 10000000, // 10M limit
    defer: true  
  }));
  app.use(express.static(process.cwd() + '/webapp', { maxAge: 1000 * 60 * 60 * 24 }));
  app.use(express.logger('dev'));

  if (config.accessControl){
    var accesscontrol = require('./lib/accesscontrol');
    app.use(accesscontrol.handle);
  } 
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// app.configure('development', function(){
//   app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
// });

// app.configure('production', function(){
//   app.use(express.errorHandler());
// });

require('./lib/main');

if(!process.argv[2] || !process.argv[2].indexOf("expresso")) {
  app.listen(config.server.port, config.server.address);
  console.log("Express server listening on port " + config.server.port);
}