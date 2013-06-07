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

// passport.authenticate('session');

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
	    	return done(null, userId)
	    }
	  });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
	console.log("Deserialize from", id);
  done(null, {id: id});
});

	// passport.deserializeUser(function(id, done) {
	//   User.findById(id, function(err, user) {
	//     done(err, user);
	//   });
	// });
// }
