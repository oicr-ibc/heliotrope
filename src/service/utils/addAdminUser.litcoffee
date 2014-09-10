> Copyright 2014(c) The Ontario Institute for Cancer Research. All rights reserved.
>
> This program and the accompanying materials are made available under the terms of the GNU Public
> License v3.0. You should have received a copy of the GNU General Public License along with this
> program. If not, see <http://www.gnu.org/licenses/>.
>
> THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
> IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
> FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
> CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
> DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
> DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
> WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY
> WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


Add an admin user
-----------------

    log4js =         require('log4js')
    logger =         log4js.getLogger()

    bcrypt =         require('bcrypt')
    mongo =          require('mongodb')
    BSON =           mongo.BSONPure
    MongoClient =    mongo.MongoClient

    argv = require('minimist')(process.argv.slice(2))

    username = argv['username']
    password = argv['password']

    config = require('../lib/configuration').getConfiguration()

    logger.info "Connecting to #{config['data']['user']['store']['url']}"
    MongoClient.connect config['data']['user']['store']['url'], (err, db) ->
      if err
        throw new Error("Can't connect to user database!")
      else
        db.collection "users", (err, users) ->
          if err
            throw new Error("Can't get users collection!");
          else
            logger.info "Adding admin user: #{username}, password: #{password}"
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