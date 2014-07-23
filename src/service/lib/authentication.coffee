module.exports.log4js = module.parent.exports.log4js
module.exports.logger = module.parent.exports.logger

sys =                  require("sys")
passport =             require("passport")
LocalStrategy =        require('passport-local').Strategy
LocalAPIKeyStrategy =  require("passport-localapikey").Strategy
crypto =               require('crypto')
mongo =                require("mongodb")

shasum =               crypto.createHash('sha1')
BSON =                 mongo.BSONPure
MongoClient =          mongo.MongoClient

## Local variables for easier access
config =               module.parent.exports.config
logger =               module.parent.exports.logger

LdapAuth =             require("./ldapauth")


connected = (callback) ->
  MongoClient.connect config['data']['userdb'], callback

saltedPassword = (string) ->
  shasum = crypto.createHash 'sha1'
  shasum.update config["password"]["salt"]
  shasum.update string
  shasum.digest 'hex'

## Define a setup for our configuration. This doesn't need to cache, as
## we're using passport to establish session-based cookies. Caching will
## get in the way of that.

config.ldap.log4js = module.parent.exports.log4js if module.parent.exports.log4js?

## The authenticator is provides a middleware component that can be used as a
## middleware in an endpoint. What it actually does, or how it does it, doesn't
## hugely matter. This is generated as a function, as there is likely to be
## different under some circumstances.

module.exports.loginAuthenticator = (options) -> passport.authenticate('local')
module.exports.apiAuthenticator = (options) -> passport.authenticate('localapikey')

## Access sometimes requires authorization. This checks that we do have a user,
## and returns the appropriate challenge if not.

module.exports.accessAuthenticator = (options) ->
  (req, res, next) ->
    user = req.user
    if user && (! options || ! options.hasOwnProperty("role") || user.hasRole(options.role))
      next()
    else
      res.set 'WWW-Authenticate', 'session'
      res.send 401, "Unauthorized"

## Serializing a user to the session is fairly simple.
serializer = (user, done) -> done(null, user.userId)

## Deserializing a user from the session requires some database lookup and role
## access. We really want to ensure that any roles are set and passed back. The
## final user object should be passed back to the front end, where it can store
## it and make it available to the front end.
deserializer = (userId, done) ->
  connected (err, db) ->
    if err
      done(err, null)
    else
      callback = (err, user) ->
        db.close()
        if user
          user.hasRole = (role) -> this["roles"].indexOf(role) != -1
        done(err, user)
      db.collection "users", (err, users) ->
        if err
          callback err, null
        else
          users.findOne {userId: userId}, callback

module.exports.serializer = serializer
module.exports.deserializer = deserializer

passport.serializeUser serializer
passport.deserializeUser deserializer

## Configure passport to use the basic strategy. The configuration is drawn from the
## setup before we get here.
## <p>
## The logic involves allowing both LDAP and direct database access. LDAP might be disabled,
## in which case database access is the only valid approach. If LDAP returns any error, we try
## the database route anyway.

heliotropeLocalStrategy = (username, password, done) ->
  databaseAuthenticate = () ->
    hash = saltedPassword password
    connected (err, db) ->
      if err
        callback err, null
      else
        databaseCallback = (err, user) ->
          db.close()
          done(err, user)

        db.collection "users", (err, users) ->
          if err
            databaseCallback(err, null)
          else
            users.find({userId: username, password: hash}).toArray (err, users) ->
              if err
                databaseCallback(err, null)
              else if users.length == 0 || users.length > 1
                databaseCallback(null, null)
              else
                databaseCallback(null, users[0])

  ldapAuthenticate = () ->

    ldapCallback = (err, user) ->
      if err || !user
        databaseAuthenticate()
      else
        userField = config.ldap.userField
        userId = user[userField]
        deserializer(userId, done)

    ldap = new LdapAuth(config.ldap)
    ldap.authenticate username, password, (err, user) ->
      ldap.close (closeErr) ->
        logger.error "Error closing LDAP client", closeErr if closeErr
        ldapCallback(err, user)

  if config['ldap']['enabled']
    ldapAuthenticate()
  else
    databaseAuthenticate()

heliotropeAPIKeyStrategy = (apikey, done) ->
  if apikey == config["heliotrope"]["apikey"]
    done null, {userId: "apikey", roles: ["APIKEY"]}
  else
    done(null, false)

passport.use(new LocalStrategy(heliotropeLocalStrategy))
passport.use(new LocalAPIKeyStrategy(heliotropeAPIKeyStrategy))

module.exports.initialize = () ->
  logger.info "Initializing authentication system"
  connected (err, db) ->
    if err
      throw new Error("Can't connect to user database!")
    else
      db.collection "users", (err, users) ->
        if err
          throw new Error("Can't get users collection!");
        else
          users.update {"userId" : "admin"},
                       {"$setOnInsert" : {"userId" : "admin", "password" : saltedPassword("admin"), "roles" : ["KB_EDITOR", "TRACKER_ADMIN"]}},
                       {"upsert": true },
                       (err, result) ->
            if err
              throw new Error("Failed to update user")


module.exports.userRequest = () ->
  (req, res) ->

    userId = req.params.user
    errorStatus = 400
    db = undefined

    done = (err, data) ->
      if db
        db.close()
      if err
        res.send errorStatus, err
      else
        res.send 200, {data: data}

    connected (err, idb) ->
      db = idb
      if err
        done(err, null)
      else
        db.collection 'users', (err, users) ->
          if err
            done(err, null)
          else if req.method == 'GET'
            if userId
              users.findOne {userId: userId}, (err, user) ->
                if err
                  done(err, null)
                else if ! user
                  done({error: "Can't find user: " + userId}, null)
                else
                  delete user.password
                  done(null, user)
            else
              users.find({}).toArray (err, user) ->
                if err
                  done(err, null)
                else
                  for u in user
                    delete u.password;
                  done(null, user)
          else if req.method == 'POST'

            body = req.body.data
            errors = []
            if body.password && body.password.length < 8
              errors.push("password must be at least eight characters long")
            if (body.password || body.confirm) && body.password != body.confirm
              errors.push("passwords do not match")

            if errors.length > 0
              done("Error: " + errors.join(", "), null)
            else
              selector = {}
              updater = {"$set" : {"userId": body.userId, "roles": body.roles}}

              selector["_id"] = if body._id then new BSON.ObjectID(body._id) else new BSON.ObjectID()
              updater["$set"]["password"] = saltedPassword(body.password) if body.password

              users.update selector, updater, {"upsert" : true, "w" : 1, "fsync" : 1}, (err, result) ->
                if err
                  done(err, null)
                else if result != 1
                  done("No user updated", null)
                else
                  done(null, body)
          else
            done("Invalid method", null)
