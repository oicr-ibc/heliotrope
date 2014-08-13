## A single component that provides the configuration data

log4js = require('log4js')
logger = log4js.getLogger('configuration')

nconf = require('nconf')

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
