// Core service components, which basically set up access to static files and other shared components.
// This should be set up for all deployments.

var app = module.parent.exports.app,
    config = module.parent.exports.config,
    authentication = require("./authentication"),
    passport = require("passport");

/**
 * The authentication ping endpoint simply sends back the deserialized user record. This isn't
 * a massive security issue as it can't be filled with too much. Besides, the roles and other
 * data might be useful. And this is the user's data, after all. This endpoint returns a status
 * of 200 for success. 
 * 
 * The primary use of this is to check access at a service level without doing anything else. 
 * It's arguably useless in Heliotrope, where much of the system is public, since using it
 * provokes authentication. 
 */

app.get('/authentication/api/ping', function(req, res){
	console.log("Authentication ping", req.user);
  var response = new Object;
  if (req.user) {
    response["user"] = req.user;
  }
  res.send(200, {data: response});
});

/**
 * The authentication login endpoint doesn't do all that much. It returns the user (which should)
 * have been deserialized from the session, and returns it in the response.
 */

app.post('/authentication/api/login', authentication.loginAuthenticator(), function(req, res){
	console.log("Authentication login", req.user);
  res.send(200, {data: {user: req.user}});
});

/**
 * The authentication logout endpoint simply evicts the session info for passport. That
 * throws away our access to the user info. This doesn't need to be authenticated, so that
 * it behaves with proper idempotence. 
 */

app.post('/authentication/api/logout', function(req, res){
	console.log("About to log out");
	req.logout();
  res.send(200, {data: "Goodbye!"});
});

app.get('/authentication/api/*', function(req, res) {
  res.send(404);
});

app.get('/test/*', function(req, res){
  var file = './webapp/test/' + req.params[0];
  res.sendfile(file);
});

app.get('/*', function(req, res){
  var file = './webapp/app/index.html';
  if (!res.getHeader('Cache-Control')) {
    res.setHeader('Cache-Control', 'public, max-age=3600');
  }
  res.sendfile(file);
});
