log4js = require('log4js')
logger = log4js.getLogger('main')

app = require('./lib/application')

config = app.locals.config

logger.info "Express server listening on port " + config['server']['port']
app.listen config['server']['port'], config['server']['address']
