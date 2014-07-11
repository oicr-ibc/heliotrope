// Heliotrope

var fs = require("fs"),
    express = require('express')
    polyfill = require('./lib/polyfill'),
    url = require("url"),
    nconf = require('nconf'),
    MongoStore = require('connect-mongo')(express),
    passport = require("passport"),
    log4js = require('log4js');

var logger = log4js.getLogger();

module.exports.logger = logger;
module.exports.log4js = log4js;

var LdapAuth = require("./lib/ldapauth");

var configFile = process.cwd()+"/config.json";
logger.info("Configuring from: " + configFile);

nconf
  .use('memory')
  .argv()
  .env()
  .file({ file: configFile });

nconf.defaults({
  'password:salt': '',
  'data:sessiondb': "mongodb://localhost:27017/session",
  'data:userdb': "mongodb://localhost:27017/user",
  'data:knowledgedb': "mongodb://localhost:27017/heliotrope",
  'data:trackerdb': "mongodb://localhost:27017/tracker",
  'data:annotationUrl': "http://localhost:8006/annotation",
  'server:port': 3000,
  'server:address': "0.0.0.0",
  'debug': true,
  'authenticate': false,
  'heliotrope:knowledgeUriBase': '/knowledge/api',
  'heliotrope:trackerUriBase': '/tracker/api',
  'heliotrope:baseUrl': 'http://localhost:3000',
  'heliotrope:apikey': 'garblemonkey',
  'ldap:url': "ldap://ldap.oicr.on.ca/",
  'ldap:searchBase': "dc=oicr,dc=on,dc=ca",
  'ldap:searchFilter': "(uid={{username}})",
  'ldap:userField': "uid",
  'ldap:cache': true,
  'ldap:enabled': false,
  'ldap:verbose': true,
  'cookieSecret': 'keyboard cat'
})

var app = module.exports.app = express();

var config = nconf.get();
module.exports.config = config;

// Config needs to be exported before we get here. And yes, this
// is a bit nasty.
var authenticator = require("./lib/authentication")

function logErrors(err, req, res, next) {
  logger.error(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.send(500, { error: "Error: " + err.name + " " + err.message, err: err });
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}

app.configure(function(){
  app.locals.pretty = true;
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/views');

  app.use(express.static(process.cwd() + '/webapp', { maxAge: 1000 * 60 * 60 * 24 }));
  app.use(express.logger('dev'));
  // app.use(log4js.connectLogger(logger, { level: 'auto', format: ':method :url :status :response-timems - :content-length' }));

  app.use(express.methodOverride());
  app.use(express.bodyParser({
    keepExtensions: true,
    limit: 10000000, // 10M limit
    defer: true
  }));

  app.use(express.cookieParser());
  app.use(express.session({
    secret: config["cookieSecret"],
    store: new MongoStore({
      url: config["data"]["sessiondb"],
      auto_reconnect: true
    })
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(logErrors);
  app.use(clientErrorHandler);
  app.use(errorHandler);

  // Unusually, we don't have global authorization here, although we could. This allows
  // the knowledge base to have public read access, without allowing access to the tracker
  // without logging in. The session here doesn't block access in the absence of a session,
  // but it does populate the session. To restrict, the authentication system needs to
  // verify the existence of req.user for routes that we need authenticated.
});

require('./lib/trackerService');
require('./lib/knowledgeService');
require('./lib/coreService');

if(!process.argv[2] || !process.argv[2].indexOf("expresso")) {
  app.listen(config['server']['port'], config['server']['address']);
  logger.info("Express server listening on port " + config['server']['port']);
}