## Main modules
express =    require('express')
log4js =     require('log4js')
nconf =      require('nconf')
passport =   require('passport')
session =    require('express-session')
MongoStore = require('connect-mongo')(session)
bodyParser = require('body-parser')

## Middlewares
methodOverride = require('method-override')
cookieParser =   require('cookie-parser')
morgan =         require('morgan')

## Make the server
app = express()

## Initialize logging
logger = log4js.getLogger()

## Configure ourselves
options = require('optimist').argv
configFile = options.config || process.cwd() + "/config.json"

nconf
  .use('memory')
  .argv()
  .env()
  .file({ file: configFile })

logger.info "Reading configuration file: #{configFile}"

nconf.defaults
  'password:salt': '',
  'data:session:secret': "keyboard cat",
  'data:session:store:url': "mongodb://localhost:27017/session",
  'data:userdb': "mongodb://localhost:27017/user",
  'data:knowledgedb': "mongodb://localhost:27017/heliotrope",
  'data:trackerdb': "mongodb://localhost:27017/tracker",
  'data:annotationUrl': "http://localhost:8006/annotation",
  'server:port': 3001,
  'server:address': "0.0.0.0",
  'debug': true,
  'authenticate': false,
  'heliotrope:knowledgeUriBase': '/api/knowledge',
  'heliotrope:trackerUriBase': '/api/tracker',
  'heliotrope:baseUrl': 'http://localhost:3000',
  'heliotrope:apikey': 'garblemonkey',
  'ldap:url': "ldap://ldap.oicr.on.ca/",
  'ldap:searchBase': "dc=oicr,dc=on,dc=ca",
  'ldap:searchFilter': "(uid={{username}})",
  'ldap:userField': "uid",
  'ldap:cache': true,
  'ldap:enabled': false,
  'ldap:verbose': true
  'report:fop': "./etc/reporting/fop.jar"
  'report:classpath': "./etc/reporting/fop/*.jar"
  'report:xsl': "./etc/reporting/fop.xsl"

config = nconf.get()

## Exports
module.exports.logger =   logger
module.exports.log4js =   log4js
module.exports.app =      app
module.exports.config =   config

app.locals.pretty = true

app.use methodOverride('X-HTTP-Method-Override')
app.use bodyParser.urlencoded(extended: true)
app.use bodyParser.json()
app.use cookieParser()
app.use morgan('short')

# See: http://stackoverflow.com/questions/22698661/mongodb-error-setting-ttl-index-on-collection-sessions
sessionStore = new MongoStore config["data"]["session"]["store"], (err) ->

  app.use session(
    secret: config["data"]["session"]["secret"]
    saveUninitialized: true
    resave: true
    store: sessionStore
  )

  app.use passport.initialize()
  app.use passport.session()

  require("./lib/coreService")
  require("./lib/knowledgeService")
  require("./lib/trackerService")

  app.listen config['server']['port'], config['server']['address']
  logger.info "Express server listening on port " + config['server']['port']
