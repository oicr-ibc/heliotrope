## This provides a basic application-wide event emitter, that can be used by
## plugins. It uses the require() method to make the same emitter shared across the
## application.
##
## Mode of use is this. A plugin can use:
##   events = require('./lib/events')
##   events.on 'step', (e) -> ....
##
## The event can send back responses using the same event system. Of course, to do
## this, the sender and receiver need to agree how to this, but that's a subsequent
## problem.

EventEmitter = require('events').EventEmitter

module.exports = new EventEmitter()

setTimeout ( -> module.exports.emit('ready')), 500
