## Main modules
express =    require('express')
log4js =     require('log4js')
passport =   require('passport')

## Middlewares
methodOverride = require('method-override')
cookieParser =   require('cookie-parser')
morgan =         require('morgan')
session =        require('express-session')
MongoStore =     require('connect-mongo')(session)
bodyParser =     require('body-parser')

## Initialize logging
logger = log4js.getLogger('main')

## Make the server
## Note we export immediately, allowing circular dependencies
app = module.exports = express()

## Write the configuration into the application locals
config = require('./configuration').getConfiguration()
app.locals.config = config

## Exports
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

  app.use '/api/authentication', require("./authenticationService")
  app.use '/api/knowledge', require("./knowledgeService")
  app.use '/api/tracker', require("./trackerService")
