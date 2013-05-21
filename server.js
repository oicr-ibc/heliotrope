// Heliotrope

var fs = require("fs"),
    util = require('util'),
    express = require('express')
    polyfill = require('./lib/polyfill'),
    url = require("url"),
    nconf = require('nconf'),
    MongoStore = require('connect-mongo')(express);

var configFile = process.cwd()+"/config.json";
console.log("Configuring from: " + configFile);

nconf
  .use('memory')
  .argv()
  .env()
  .file({ file: configFile });

nconf.defaults({
  'db:port': 27017,
  'db:host': 'localhost',
  'db:session:name': 'session',
  'server:port': 3000,
  'server:address': "0.0.0.0",
  'flavor': "regular",
  'debug': true,
  'heliotrope:knowledgeUriBase': '/knowledge/api',
  'heliotrope:trackerUriBase': '/tracker/api',
  'heliotrope:knowledgeServiceUrl': 'http://localhost:3000/knowledge/api',
  'heliotrope:knowledgeUrl': 'http://localhost:3000',
  'ldap:url': "ldap://ldap.oicr.on.ca/",
  'ldap:adminDn': "uid=myadminusername,ou=users,o=example.com",
  'ldap:adminPassword': "mypassword",
  'ldap:searchBase': "dc=oicr,dc=on,dc=ca",
  'ldap:searchFilter': "(memberUid={{username}})",
  'cookieSecret': 'keyboard cat'
})

var app = module.exports.app = express();

var config = nconf.get();
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

  app.use(express.cookieParser());
  app.use(express.session({
    secret: config["cookieSecret"],
    store: new MongoStore({
      db: config["db"]["session"]["name"],
      host: config["db"]["host"],
      port: config["db"]["port"],
      auto_reconnect: true
    })
  }));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

require('./lib/trackerService');
require('./lib/knowledgeService');
require('./lib/coreService');

if(!process.argv[2] || !process.argv[2].indexOf("expresso")) {
  app.listen(config['server']['port'], config['server']['address']);
  console.log("Express server listening on port " + config['server']['port']);
}