path = require("path")
glob = require("glob")
async = require("async")
log4js = require("log4js")

config = require('./configuration').getConfiguration()
pluginDirectory = config['plugins']
pluginQuery = path.join(pluginDirectory, '**/*.js')

## Initialize logging
logger = log4js.getLogger('plugins')

appEvents = require('./events')
appEvents.on 'ready', (e) ->
  logger.debug "Globbing", pluginQuery
  glob pluginQuery, {}, (err, files) ->
    logger.info "Initializing plugins"
    for file in files
      logger.info "Loading plugin: #{file}"
      require(file)

