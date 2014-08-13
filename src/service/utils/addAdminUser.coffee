log4js =         require('log4js')
logger =         log4js.getLogger()

module.exports.logger =   logger
module.exports.log4js =   log4js

bcrypt =         require('bcrypt')
mongo =          require('mongodb')
BSON =           mongo.BSONPure
MongoClient =    mongo.MongoClient

argv = require('minimist')(process.argv.slice(2))

username = argv['username']
password = argv['password']

config = require('../lib/configuration').getConfiguration()

logger.info "Adding admin user: #{username}, password: #{password}"
MongoClient.connect config['data']['user']['store']['url'], (err, db) ->
  if err
    throw new Error("Can't connect to user database!")
  else
    db.collection "users", (err, users) ->
      if err
        throw new Error("Can't get users collection!");
      else
        bcrypt.genSalt 10, (err, salt) ->
          bcrypt.hash password, salt, (err, hash) ->
            users.update {"userId" : username},
                         {"$setOnInsert" : {"userId" : username, "password" : hash, "roles" : ["KB_EDITOR", "TRACKER_ADMIN"]}},
                         {"upsert": true },
                         (err, result) ->
              if err
                throw new Error("Failed to update user")
              db.close (err, result) ->
                if err?
                  logger.error "Error on close", err
                  process.exit(1)
                else
                  process.exit()