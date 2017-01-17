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


The main Heliotrope application
-------------------------------

Imports for the primary modules and the middlewares needed.

    # Main modules
    express =    require('express')
    log4js =     require('log4js')
    passport =   require('passport')

    # Middlewares
    methodOverride = require('method-override')
    cookieParser =   require('cookie-parser')
    morgan =         require('morgan')
    session =        require('express-session')
    MongoStore =     require('connect-mongo')(session)
    bodyParser =     require('body-parser')
    busboy =         require('connect-busboy')


Initialize the server and the logging framework

    # Initialize logging
    logger = log4js.getLogger('main')

    # Make the server
    # Note we export immediately, allowing circular dependencies
    app = module.exports = express()

    # Start the plugin system
    require('./plugins')


Set up some application local variables. These can be accessed throughout
the application through the `app.locals` property.

    # Write the configuration into the application locals
    config = require('./configuration').getConfiguration()
    app.locals.config = config

    # Exports
    app.locals.pretty = true


Add the middlewares.

    app.use methodOverride('X-HTTP-Method-Override')
    app.use bodyParser.urlencoded(extended: true)
    app.use bodyParser.json()
    app.use cookieParser()
    app.use morgan('short')
    app.use busboy()


Add session handling, and once it is set up, start passport and its session-handling
dependencies.

    app.use session(
      secret: config["data"]["session"]["secret"]
      saveUninitialized: true
      resave: true
      store: new MongoStore config["data"]["session"]["store"]
    )

    app.use passport.initialize()
    app.use passport.session()

Most of the application is managed through sub-parts of the URI space. Each of these
modules exports an express router, that is added to manage that part of the application
system.

    app.use '/api/authentication', require("./authenticationService")
    app.use '/api/knowledge', require("./knowledgeService")
    app.use '/api/tracker', require("./trackerService")
