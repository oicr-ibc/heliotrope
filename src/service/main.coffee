## Main modules
express =   require('express')
log4js =    require('log4js')
nconf =     require('nconf')

## Middlewares
methodOverride = require('method-override')
cookieParser =   require('cookie-parser')
morgan =         require('morgan')

## Make the server
app = express()

## Initialize logging
logger = log4js.getLogger()

## Configure ourselves
configFile = process.cwd() + "/config.json"

nconf
  .use('memory')
  .argv()
  .env()
  .file({ file: configFile })

nconf.defaults
  'password:salt': '',
  'data:sessiondb': "mongodb://localhost:27017/session",
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
  'ldap:verbose': true,
  'cookieSecret': 'keyboard cat'

config = nconf.get()

## Exports
module.exports.logger =   logger
module.exports.log4js =   log4js
module.exports.app =      app
module.exports.config =   config

app.locals.pretty = true

app.use methodOverride('X-HTTP-Method-Override')
app.use cookieParser()
app.use morgan('short')

## Now bring in the service components
app.get '/api/authentication/ping', (req, res) ->
  response = new Object
  if req.user
    response["user"] = req.user
  res.send 200, {data: response}

require("./lib/knowledgeService")
require("./lib/trackerService")

app.listen config['server']['port'], config['server']['address']
logger.info "Express server listening on port " + config['server']['port']
