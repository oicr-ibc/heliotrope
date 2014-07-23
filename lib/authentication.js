/**
 * Define all our imports!
 */

module.exports.log4js = module.parent.exports.log4js;
module.exports.logger = module.parent.exports.logger;

var sys = require("sys");
var logger = module.exports.logger;

var passport = require("passport"),
    LocalStrategy = require('passport-local').Strategy,
    LocalAPIKeyStrategy = require("passport-localapikey").Strategy,
    config = module.parent.exports.config,
    crypto = require('crypto'),
    shasum = crypto.createHash('sha1');

var LdapAuth = require("./ldapauth");

var mongo = require("mongodb"),
    BSON = mongo.BSONPure,
    MongoClient = mongo.MongoClient;

function connected(callback) {
  MongoClient.connect(config['data']['userdb'], callback);
}

function saltedPassword(string) {
	var shasum = crypto.createHash('sha1');
	shasum.update(config["password"]["salt"]);
	shasum.update(string);
	return shasum.digest('hex');
}

/**
 * Define a setup for our configuration. This doesn't need to cache, as 
 * we're using passport to establish session-based cookies. Caching will 
 * get in the way of that.
 */

if (module.parent.exports.log4js) {
	config.ldap.log4js = module.parent.exports.log4js;
}

/**
 * The authenticator is provides a middleware component that can be used as a
 * middleware in an endpoint. What it actually does, or how it does it, doesn't
 * hugely matter. This is generated as a function, as there is likely to be
 * different under some circumstances. 
 */

module.exports.loginAuthenticator = function(options) {
	return passport.authenticate('local');
}

/**
 * Access sometimes requires authorization. This checks that we do have a user,
 * and returns the appropriate challenge if not. 
 */

module.exports.accessAuthenticator = function(options) {
	return function(req, res, next) {
		var user = req.user;
		if (user && (! options || ! options.hasOwnProperty("role") || user.hasRole(options.role))) {
			next()
		} else {
			res.set('WWW-Authenticate', 'session');
			res.send(401, "Unauthorized");
		}
	}
}

/**
 * API access requires authorization. This checks that we do have a user,
 * and returns the appropriate challenge if not. 
 */

module.exports.apiAuthenticator = function(options) {
	return passport.authenticate('localapikey');
}

/**
 * Serializing a user to the session is fairly simple.  
 */

function serializer(user, done) {
  done(null, user.userId);
};

/**
 * Deserializing a user from the session requires some database lookup and role
 * access. We really want to ensure that any roles are set and passed back. The 
 * final user object should be passed back to the front end, where it can store
 * it and make it available to the front end. 
 */

function deserializer(userId, done) {
	connected(function(err, db) {
		if (err) return done(err, null);
		var callback = function(err, user) {
			db.close();
			if (user) {
				user.hasRole = function(role) {
					return this["roles"].indexOf(role) !== -1;
				}
			}
			return done(err, user);
		}
		db.collection("users", function(err, users) {
			if (err) return callback(err, null);
			users.findOne({userId: userId}, callback);
		});
	})
};

module.exports.serializer = serializer
module.exports.deserializer = deserializer

passport.serializeUser(serializer);
passport.deserializeUser(deserializer);

/**
 * Configure passport to use the basic strategy. The configuration is drawn from the
 * setup before we get here. 
 * <p>
 * The logic involves allowing both LDAP and direct database access. LDAP might be disabled,
 * in which case database access is the only valid approach. If LDAP returns any error, we try 
 * the database route anyway. 
 */

passport.use(new LocalStrategy(
  function(username, password, done) {
     logger.info("Using LocalStrategy: %s", username);
  	function databaseAuthenticate() {
                logger.info("Using database", username);
  		var hash = saltedPassword(password);
  		connected(function(err, db) {
  			if (err) return callback(err, null);

  			function databaseCallback(err, user) {
  				db.close();
                                logger.info("Closing and returning: %s, %s", err, sys.inspect(user));
  				return done(err, user);
  			}

				db.collection("users", function(err, users) {

					if (err) return databaseCallback(err, null);

					users.find({userId: username, password: hash}).toArray(function(err, users) {
						if (err) return databaseCallback(err, null);
						if (users.length === 0) return databaseCallback(null, null);
						if (users.length > 1) return databaseCallback(null, null);
						return databaseCallback(null, users[0])
					});
				});
			})
  	}

  	function ldapAuthenticate() {
		logger.info("Using LDAP");
	  	function ldapCallback(err, user) {

		    if (err) {
		      return databaseAuthenticate();
		    } else if (!user) { 
		    	return databaseAuthenticate(); 
		    } else {
		      var userField = config.ldap.userField;
		      var userId = user[userField];
		      deserializer(userId, done);
	    	}
	    }

  		var ldap = new LdapAuth(config.ldap);
		ldap.authenticate(username, password, function(err, user) {
                  ldap.close(function(closeErr) {
                    if (closeErr) {
                      logger.error("Error when closing", closeErr);
                    };
                    ldapCallback(err, user);
		  });
		});
  	}

		if (config['ldap']['enabled']) {
			ldapAuthenticate();
		} else {
			databaseAuthenticate();
		}
  }
));

/**
 * Configure passport to use a local apikey strategy. This is only used for a very few
 * purposes. There is only one user for it, and it's wired right into the source code
 * at present. 
 */
passport.use(new LocalAPIKeyStrategy(
  function(apikey, done) {
  	if (apikey === config["heliotrope"]["apikey"]) {
  		return done(null, {userId: "apikey", roles: ["APIKEY"]})
  	} else {
  		return done(null, false);
  	}
  }
));

function initialize() {
	connected(function(err, db) {
		if (err) throw new Error("Can't connect to user database!");

		db.collection("users", function(err, users) {
			if (err) throw new Error("Can't get users collection!");

			users.update({"userId" : "admin"}, 
				           {"$setOnInsert" : {"userId" : "admin", "password" : saltedPassword("admin"), "roles" : ["KB_EDITOR", "TRACKER_ADMIN"]}}, 
				           {"upsert": true },
				           function(err, result) {
				if (err) throw new Error("Failed to update user");
			});
		});
	});
}

module.exports.initialize = initialize;

function userRequest() {
	return function(req, res) {

		var userId = req.params.user;
		var errorStatus = 400;
		var db;

		function done(err, data) {
			if (db) db.close();
			if (err) {
				res.send(errorStatus, err);
			} else {
				res.send(200, {data: data});
			}
		}

		connected(function(err, idb) {
			db = idb;
			if (err) return done(err, null);
			db.collection('users', function(err, users) {
				if (err) return done(err, null);

				if (req.method == 'GET') {
					if (userId) {
						users.findOne({userId: userId}, function(err, user) {
							if (err) return done(err, null);
							if (! user) return done({error: "Can't find user: " + userId}, null);
							delete user.password;
							return done(null, user);
						});
					} else {
						users.find({}).toArray(function(err, user) {
							if (err) return done(err, null);
							user.forEach(function(u) {
								delete u.password;
							});
							return done(null, user);
						});
					}
				} else if (req.method == 'POST') {

					var body = req.body.data;
					var errors = [];
					if (body.password && body.password.length < 8)
						errors.push("password must be at least eight characters long")
					if ((body.password || body.confirm) && body.password != body.confirm)
						errors.push("passwords do not match");

					if (errors.length > 0)
						return done("Error: " + errors.join(", "), null);
					else {
						var selector = {};
						var updater = {"$set" : {"userId": body.userId}};

						if (body._id) {
							selector["_id"] = new BSON.ObjectID(body._id);
						} else {
							selector["_id"] = new BSON.ObjectID();
						}

						if (body.password) {
  						updater["$set"]["password"] = saltedPassword(body.password);
						}
						updater["$set"]["roles"] = body.roles;

						users.update(selector, updater, {"upsert" : true, "w" : 1, "fsync" : 1}, function(err, result) {
							if (err)
								return done(err, null)
							else if (result != 1) 
								return done("No user updated", null)
							else 
								return done(null, body);
						});
					}
				} else {
					return done("Invalid method", null)
				}
			});
	  });
  }
}

module.exports.userRequest = userRequest;
