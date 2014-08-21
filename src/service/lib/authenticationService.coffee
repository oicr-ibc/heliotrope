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
logger = log4js.getLogger('configuration')

authentication = require("./authentication")

## The authentication ping endpoint simply sends back the deserialized user record. This isn't
## a massive security issue as it can't be filled with too much. Besides, the roles and other
## data might be useful. And this is the user's data, after all. This endpoint returns a status
## of 200 for success.
##
## The primary use of this is to check access at a service level without doing anything else.
## It's arguably useless in Heliotrope, where much of the system is public, since using it
## provokes authentication.

router = require('express').Router()

router.get '/ping', (req, res, next) ->
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

router.post '/login', fakeFormValues, authentication.loginAuthenticator(), (req, res) ->
  res.status(200).send {data: {user: req.user}}

router.post '/logout', (req, res) ->
  req.logout()
  res.status(200).send {data: "Goodbye!"}

router.get '/users', authentication.accessAuthenticator({role: "TRACKER_ADMIN"}), authentication.userRequest()
router.get '/users/:user', authentication.accessAuthenticator({role: "TRACKER_ADMIN"}), authentication.userRequest()
router.post '/users', authentication.accessAuthenticator({role: "TRACKER_ADMIN"}), authentication.userRequest()

router.get '/*', (req, res) ->
  res.status(404).send()

module.exports = router
