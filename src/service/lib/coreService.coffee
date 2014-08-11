module.exports.log4js = module.parent.exports.log4js
module.exports.logger = module.parent.exports.logger
module.exports.config = module.parent.exports.config

app =    module.parent.exports.app
config = module.parent.exports.config

authentication = require("./authentication")
authentication.initialize()

## The authentication ping endpoint simply sends back the deserialized user record. This isn't
## a massive security issue as it can't be filled with too much. Besides, the roles and other
## data might be useful. And this is the user's data, after all. This endpoint returns a status
## of 200 for success.
##
## The primary use of this is to check access at a service level without doing anything else.
## It's arguably useless in Heliotrope, where much of the system is public, since using it
## provokes authentication.

app.get '/api/authentication/ping', (req, res) ->
  response = new Object
  if req.user
    response["user"] = req.user
  res.status(200).send {data: response}

## The authentication login endpoint doesn't do all that much. It returns the user (which should)
## have been deserialized from the session, and returns it in the response. The one key proviso
## here is that we fake the username and password query fields, because if we don't passport
## will fail with a 400 error. The client shouldn't need to know that.

fakeFormValues = (req, res, next) ->
  req.query.username = 'unknown' if !req.query.username
  req.query.password = 'unknown' if !req.query.password
  next()

app.post '/api/authentication/login', fakeFormValues, authentication.loginAuthenticator(), (req, res) ->
  res.status(200).send {data: {user: req.user}}

app.post '/api/authentication/logout', (req, res) ->
  req.logout()
  res.status(200).send {data: "Goodbye!"}

app.get '/api/authentication/users', authentication.accessAuthenticator({role: "TRACKER_ADMIN"}), authentication.userRequest()
app.get '/api/authentication/users/:user', authentication.accessAuthenticator({role: "TRACKER_ADMIN"}), authentication.userRequest()
app.post '/api/authentication/users', authentication.accessAuthenticator({role: "TRACKER_ADMIN"}), authentication.userRequest()

app.get '/api/authentication/*', (req, res) ->
  res.status(404).send()

