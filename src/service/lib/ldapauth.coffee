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

## Copyright 2011 (c) Trent Mick.
##
## LDAP auth.
##
## Usage:
##    var LdapAuth = require('ldapauth');
##    var auth = new LdapAuth({url: 'ldaps://ldap.example.com:663', ...});
##    ...
##    auth.authenticate(username, password, function (err, user) { ... });
##    ...
##    auth.close(function (err) { ... })

assert = require('assert')
bcrypt = require('bcrypt')
ldap =   require('ldapjs')
debug =   console.warn
format = require('util').format

## Create an LDAP auth class. Primary usage is the `.authenticate` method.
##
## @param opts {Object} Config options. Keys (required, unless says
##      otherwise) are:
##    url {String} E.g. 'ldaps://ldap.example.com:663'
##    adminDn {String} E.g. 'uid=myapp,ou=users,o=example.com'
##    adminPassword {String} Password for adminDn.
##    searchBase {String} The base DN from which to search for users by
##        username. E.g. 'ou=users,o=example.com'
##    searchFilter {String} LDAP search filter with which to find a user by
##        username, e.g. '(uid={{username}})'. Use the literal '{{username}}'
##        to have the given username be interpolated in for the LDAP
##        search.
##    log4js {Module} Optional. The require'd log4js module to use for logging.
##        logging. If given this will result in TRACE-level logging for
##        ldapauth.
##    verbose {Boolean} Optional, default false. If `log4js` is also given,
##        this will add TRACE-level logging for ldapjs (quite verbose).
##    cache {Boolean} Optional, default false. If true, then up to 100
##        credentials at a time will be cached for 5 minutes.

class LdapAuth

  constructor: (@opts) ->
    assert.ok(@opts.url);
    assert.ok(@opts.searchBase);
    assert.ok(@opts.searchFilter);

    @log = @opts.log4js && @opts.log4js.getLogger('ldapauth');

    if @opts.cache
      Cache = require('./cache')
      @userCache = new Cache(100, 300, this.log, 'user')

    clientOpts = {
      url: @opts.url
      connectTimeout: parseInt(process.env.LDAP_CONNECT_TIMEOUT || 0, 10)
    }
    if @opts.log4js && @opts.verbose
      clientOpts.log4js = @opts.log4js

    @_adminClient = ldap.createClient(clientOpts);
    @_adminBound = false;
    @_adminBindRequired = (@opts.adminDn ? true : false);
    @_userClient = ldap.createClient(clientOpts);

    @_salt = bcrypt.genSaltSync();

  close: (callback) ->
    if ! @_adminBound
      callback()
    else
      @_adminClient.unbind (err) ->
        callback(err)

  ## Ensure that `this._adminClient` is bound.
  _adminBind: (callback) ->
    if @_adminBound || ! @_adminBindRequired
      callback();
    else
      self = this
      @_adminClient.bind @opts.adminDn, @opts.adminPassword, (err) ->
        if err
          self.log && self.log.trace('ldap authenticate: bind error: %s', err)
          callback(err)
        else
          @_adminBound = true
          callback()


  ## Find the user record for the given username.
  ##
  ## @param username {String}
  ## @param callback {Function} `function (err, user)`. If no such user is
  ##    found but no error processing, then `user` is undefined.
  _findUser: (username, callback) ->
    self = this
    if !username
      callback("empty username")
    else
      @_adminBind (err) ->
        if err
          callback(err)
        else
          searchFilter = self.opts.searchFilter.replace('{{username}}', username)
          opts = {filter: searchFilter, scope: 'sub'}
          @_adminClient.search self.opts.searchBase, opts, (err, result) ->
            if err
              self.log && self.log.trace('ldap authenticate: search error: %s', err)
              callback(err)
            else
              items = []
              result.on 'searchEntry', (entry) -> items.push(entry.object)

              result.on 'error', (err) ->
                self.log && self.log.trace('ldap authenticate: search error event: %s', err)
                callback(err)

              result.on 'end', (result) ->
                if result.status != 0
                  err = 'non-zero status from LDAP search: ' + result.status
                  self.log && self.log.trace('ldap authenticate: %s', err)
                  callback(err)
                else
                  switch items.length
                    when 0 then callback()
                    when 1 then callback(null, items[0])
                    else callback(format('unexpected number of matches (%s) for "%s" username', items.length, username))


  authenticate: (username, password, callback) ->
    self = this

    if @opts.cache
      # Check cache. 'cached' is `{password: <hashed-password>, user: <user>}`.
      cached = @userCache.get(username)
      if cached && bcrypt.compareSync(password, cached.password)
        callback(null, cached.user)
    else
      self = this
      self._findUser username, (err, user) ->
        if err
          callback(err)
        else if !user
          callback(null, false, {message: format('no such user: "%s"', username)})
        else
          self._userClient.bind user.dn, password, (err) ->
            if err
              self.log && self.log.trace('ldap authenticate: bind error: %s', err)
              callback(null, false, {message: err})
            else if self.opts.cache
              bcrypt.hash password, self._salt, (err, hash) ->
                self.userCache.set username, {password: hash, user: user}
                callback(null, user)
            else
              callback(null, user);


module.exports = LdapAuth