/**
 * Define all our imports!
 */

var sys = require("sys");

var passport = require("passport"),
    LocalStrategy = require('passport-local').Strategy,
    LocalAPIKeyStrategy = require("passport-localapikey").Strategy,
    LdapAuth = require("./ldapauth"),
    config = module.parent.exports.config;

var mongo = require("mongodb"),
    BSON = mongo.BSONPure,
    MongoClient = mongo.MongoClient;

function connected(callback) {
  MongoClient.connect(config['data']['userdb'], callback);
}

/**
 * Define a setup for our configuration. This doesn't need to cache, as 
 * we're using passport to establish session-based cookies. Caching will 
 * get in the way of that.
 */

var ldap = new LdapAuth({
  url: config.ldap.url,
  searchBase: config.ldap.searchBase,
  searchFilter: config.ldap.searchFilter,
  cache: true
});

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
 */

passport.use(new LocalStrategy(
  function(username, password, done) {
  	ldap.authenticate(username, password, function (err, user) {
	    if (err) {
	      return done(err);
	    } else if (!user) { 
	    	return done(null, false); 
	    } else {
	      var userField = config.ldap.userField;
	      var userId = user[userField];
	      deserializer(userId, done);
	    }
	  });
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