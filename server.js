// Heliotrope

var fs = require("fs"),
    util = require('util'),
    express = require('express')
    polyfill = require('./lib/polyfill'),
    url = require("url"),
    nconf = require('nconf'),
    MongoStore = require('connect-mongo')(express),
    passport = require("passport"),
    LdapAuth = require("./lib/ldapauth"),
    colors = require('colors');

var configFile = process.cwd()+"/config.json";
console.log(("Configuring from: " + configFile).magenta);

nconf
  .use('memory')
  .argv()
  .env()
  .file({ file: configFile });

nconf.defaults({
  'db:port': 27017,
  'db:host': 'localhost',
  'db:session:name': 'session',
  'data:userdb': "mongodb://localhost:27017/user",
  'server:port': 3000,
  'server:address': "0.0.0.0",
  'flavor': "regular",
  'debug': true,
  'authenticate': false, 
  'heliotrope:knowledgeUriBase': '/knowledge/api',
  'heliotrope:trackerUriBase': '/tracker/api',
  'heliotrope:knowledgeServiceUrl': 'http://localhost:3000/knowledge/api',
  'heliotrope:knowledgeUrl': 'http://localhost:3000',
  'heliotrope:apikey': 'garblemonkey',
  'ldap:url': "ldap://ldap.oicr.on.ca/",
  'ldap:searchBase': "dc=oicr,dc=on,dc=ca",
  'ldap:searchFilter': "(uid={{username}})",
  'ldap:userField': "uid",
  'cookieSecret': 'keyboard cat'
})

var app = module.exports.app = express();

var config = nconf.get();
module.exports.config = config;

// Config needs to be exported before we get here. And yes, this
// is a bit nasty. 
var authenticator = require("./lib/authentication")

var ldap = new LdapAuth({
  url: config.ldap.url,
  searchBase: config.ldap.searchBase,
  searchFilter: config.ldap.searchFilter,
  cache: true
});

var authenticate = express.basicAuth(function (username, password, callback) {
  ldap.authenticate(username, password, function (err, user) {
    if (err) {
      console.log("LDAP auth error: %s", err);
    }
    callback(err, user)
  });
});

app.locals.authenticate = authenticate;

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
  app.use(passport.initialize());
  app.use(passport.session());

  // Unusually, we don't have global authorization here, although we could. This allows
  // the knowledge base to have public read access, without allowing access to the tracker
  // without logging in. The session here doesn't block access in the absence of a session,
  // but it does populate the session. To restrict, the authentication system needs to 
  // verify the existence of req.user for routes that we need authenticated. 
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
  console.log(("Express server listening on port " + config['server']['port']).magenta);
}