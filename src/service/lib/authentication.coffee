## Copyright 2014(c) The Ontario Institute for Cancer Research. All rights reserved.
##
## This program and the accompanying materials are made available under the terms of the GNU Public
## License v3.0. You should have received a copy of the GNU General Public License along with this
## program. If not, see <http://www.gnu.org/licenses/>.
##
## THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
## IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
## FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
## CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
## DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
## DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
## WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY
## WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

log4js = require('log4js')
logger = log4js.getLogger('authentication')

sys =                  require("sys")
passport =             require("passport")
LocalStrategy =        require('passport-local').Strategy
LocalAPIKeyStrategy =  require("passport-localapikey").Strategy
crypto =               require('crypto')
bcrypt =               require('bcrypt')
mongo =                require("mongodb")

shasum =               crypto.createHash('sha1')
BSON =                 mongo.BSONPure
MongoClient =          mongo.MongoClient

LdapAuth =             require("./ldapauth")

## Use circular dependencies to get access to the app, and through that, to the
## configuration in app.locals.config.
app = require('./application')
config = app.locals.config

connected = (callback) ->
  MongoClient.connect config['data']['user']['store']['url'], callback

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
      res.status(401).send "Unauthorized"

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
    connected (err, db) ->
      if err
        callback err, null
      else
        databaseCallback = (err, user, message) ->
          db.close()
          done(err, user, message)

        db.collection "users", (err, users) ->
          if err
            databaseCallback err, null
          else
            users.findOne {userId: username}, (err, user) ->
              return databaseCallback(err) if err?
              return databaseCallback(null, false, { message: 'Incorrect username' }) if users.length == 0 || users.length > 1
              bcrypt.compare password, user.password, (err, res) ->
                return databaseCallback(err) if err?
                if !res
                  databaseCallback null, false, { message: 'Incorrect password' }
                else
                  databaseCallback null, user

  ldapAuthenticate = () ->

    ldapCallback = (err, user, message) ->
      if err || !user
        databaseAuthenticate()
      else
        userField = config.ldap.userField
        userId = user[userField]
        deserializer(userId, done)

    ldap = new LdapAuth(config.ldap)
    ldap.authenticate username, password, (err, user, message) ->
      ldap.close (closeErr) ->
        logger.error "Error closing LDAP client", closeErr if closeErr
        ldapCallback(err, user, message)

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

module.exports.initializeAdminUser = (userId, password) ->
  logger.info "Adding admin user: #{userId}, password: #{password}"
  connected (err, db) ->
    if err
      throw new Error("Can't connect to user database!")
    else
      db.collection "users", (err, users) ->
        if err
          throw new Error("Can't get users collection!");
        else
          bcrypt.genSalt 10, (err, salt) ->
            bcrypt.hash password, salt, (err, hash) ->
              users.update {"userId" : userId},
                           {"$setOnInsert" : {"userId" : userId, "password" : hash, "roles" : ["KB_EDITOR", "TRACKER_ADMIN"]}},
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
