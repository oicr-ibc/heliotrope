// Core service components, which basically set up access to static files and other shared components.
// This should be set up for all deployments.

module.exports.log4js = module.parent.exports.log4js;
module.exports.logger = module.parent.exports.logger;

var app = module.parent.exports.app,
    config = module.parent.exports.config,
    authentication = require("./authentication"),
    passport = require("passport");

authentication.initialize();

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
  res.send(200, {data: {user: req.user}});
});

/**
 * The authentication logout endpoint simply evicts the session info for passport. That
 * throws away our access to the user info. This doesn't need to be authenticated, so that
 * it behaves with proper idempotence. 
 */

app.post('/authentication/api/logout', function(req, res){
	req.logout();
  res.send(200, {data: "Goodbye!"});
});

/**
 * Under conditions of decently strict authentication, return a list of users. 
 */

app.get('/authentication/api/users', authentication.accessAuthenticator({role: "TRACKER_ADMIN"}), authentication.userRequest());
app.get('/authentication/api/users/:user', authentication.accessAuthenticator({role: "TRACKER_ADMIN"}), authentication.userRequest());
app.post('/authentication/api/users', authentication.accessAuthenticator({role: "TRACKER_ADMIN"}), authentication.userRequest());

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
