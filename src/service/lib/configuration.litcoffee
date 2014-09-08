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


Heliotrope configuration
------------------------

Imports for the application configuration system.

    log4js = require('log4js')
    logger = log4js.getLogger('configuration')

    nconf = require('nconf')


Heliotrope looks for a configuration file, either passed as a command-line option, or called `config.json` and in
the current working directory. This is a JSON file, and is parsed to provide a wide range of settings throughout
the application. Default values are set here, and in many cases, the default values are sensible.

The module exports a function `getConfiguration` which returns the generated configuration. Although this could be
called repatedly, that would involve parsing the file repeatedly. It is better to use this once to get the
configuration and store it, say in `app.locals`, where it can be accessed everywhere it is needed.

    ## Configure ourselves
    module.exports.getConfiguration = () ->
      options = require('minimist')(process.argv.slice(2))
      configFile = options.config || process.cwd() + "/config.json"

      nconf
        .use('memory')
        .argv()
        .file({ file: configFile })

      logger.info "Reading configuration file: #{configFile}"

      nconf.defaults
        'password:salt': '',
        'data:session:secret': "keyboard cat",
        'data:session:store:url': "mongodb://localhost:27017/session",
        'data:user:store:url': "mongodb://localhost:27017/user",
        'data:knowledge:store:url': "mongodb://localhost:27017/heliotrope",
        'data:tracker:store:url': "mongodb://localhost:27017/tracker",
        'data:annotationUrl': "http://localhost:8006/annotation",
        'server:port': 3001,
        'server:address': "0.0.0.0",
        'debug': true,
        'plugins': 'src/service/plugins'
        'plugin:vcf:vep_home': "#{process.env.HOME}/ensembl-tools/scripts/variant_effect_predictor",
        'plugin:vcf:fasta_path': "#{process.env.HOME}/.vep/homo_sapiens/75/Homo_sapiens.GRCh37.75.dna.primary_assembly.fa",
        'plugin:vcf:vep_cache_directory': "#{process.env.HOME}/.vep",
        'authenticate': false,
        'heliotrope:knowledgeUriBase': '/api/knowledge',
        'heliotrope:trackerUriBase': '/api/tracker',
        'heliotrope:baseUrl': 'http://localhost:3000',
        'heliotrope:apikey': 'garblemonkey',
        'ldap:url': "ldap://ldap.oicr.on.ca/",
        'ldap:searchBase': "dc=oicr,dc=on,dc=ca",
        'ldap:searchFilter': "(uid={{username}})",
        'ldap:userField': "uid",
        'ldap:cache': true,
        'ldap:enabled': false,
        'ldap:verbose': true,
        'report:fop': "./etc/reporting/fop.jar"
        'report:classpath': "./etc/reporting/fop/*.jar"
        'report:xsl': "./etc/reporting/fop.xsl"

      nconf.get()
