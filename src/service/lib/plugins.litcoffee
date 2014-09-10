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


Plugins
----------------------

	path = require("path")
    glob = require("glob")
    async = require("async")
    log4js = require("log4js")

    config = require('./configuration').getConfiguration()
    pluginDirectory = config['plugins']
    pluginQuery = path.join(pluginDirectory, '**/*.js')


Initialize logging

    logger = log4js.getLogger('plugins')


Glob and load all the plugin components. These can then use the event system to listen for
events happening across the application.

    appEvents = require('./events')
    appEvents.on 'ready', (e) ->
      logger.debug "Globbing", pluginQuery
      glob pluginQuery, {}, (err, files) ->
        logger.info "Initializing plugins"
        for file in files
          logger.info "Loading plugin: #{file}"
          require(file)

