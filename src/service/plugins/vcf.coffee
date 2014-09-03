log4js = require('log4js')

appEvents = require('../lib/events')
logger = log4js.getLogger('vcf')

logger.info "Loading plugin: vcf"

## This is where we can hook into the handling lifecycle. This allows us to get
## data from the system. The event gives us a few additional routines that we
## can use, as a convenience for the plugin framework.

appEvents.on 'step:samples:recordResults', (evt) ->
  logger.info "Handling step:samples:recordResults", evt

  evt.callback(evt.data)
