/**
 * Define all our imports!
 */

var sys = require("sys");

var passport = require("passport"),
    LocalStrategy = require('passport-local').Strategy,
    LdapAuth = require("./ldapauth"),
    config = module.parent.exports.config;

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
		if (req.user) {
			next()
		} else {
			res.set('WWW-Authenticate', 'session');
			res.send(401, "Unauthorized");
		}
	}
}

/**
 * Serializing a user to the session is fairly simple.  
 */

function serializer(user, done) {
  done(null, user.id);
};

/**
 * Deserializing a user from the session requires some database lookup and role
 * access. We really want to ensure that any roles are set and passed back. The 
 * final user object should be passed back to the front end, where it can store
 * it and make it available to the front end. 
 */

function deserializer(userId, done) {
	console.log("Deserializing from", userId);
  done(null, {id: userId});
};

passport.serializeUser(serializer);
passport.deserializeUser(deserializer);

/**
 * Configure passport to use the basic strategy. The configuration is drawn from the
 * setup before we get here. 
 */

passport.use(new LocalStrategy(
  function(username, password, done) {
  	console.log("Authenticating", username, password);
  	ldap.authenticate(username, password, function (err, user) {
	    if (err) {
	      console.log("LDAP auth error: %s", err);
	      return done(err);
	    } else if (!user) { 
	      console.log("LDAP no user: %s");
	    	return done(null, false); 
	    } else {
	      var userField = config.ldap.userField;
	      var userId = user[userField];
	      console.log("LDAP found user id: ", userId);
	      deserializer(userId, done);
	    }
	  });
  }
));
