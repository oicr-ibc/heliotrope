/* 
    server.js
    mongodb-rest

    Created by Tom de Grunt on 2010-10-03.
    Copyright (c) 2010 Tom de Grunt.
    This file is part of mongodb-rest.
*/ 

var fs = require("fs"),
    util = require('util'),
    express = require('express');

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
  app.use(express.bodyParser({
    keepExtensions: true,
    limit: 10000000, // 10M limit
    defer: true  
  }));
  app.use(express.static(process.cwd() + '/webapp'));
  app.use(express.logger());

  if (config.accessControl){
    var accesscontrol = require('./lib/accesscontrol');
    app.use(accesscontrol.handle);
  } 
});

require('./lib/main');

if(!process.argv[2] || !process.argv[2].indexOf("expresso")) {
  app.listen(config.server.port, config.server.address);
}