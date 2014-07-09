## An expiring LRU cache.
##
## Usage:
##     var Cache = require('amon-common').Cache;
##                                // size, expiry, log,  name
##     this.accountCache = new Cache( 10,    400, log, 'account');
##     this.accountCache.set('morag', {...});
##     ...
##     this.accountCache.get('morag')    // -> {...}

debug =   console.warn
assert =  require('assert')
LRU =     require('lru-cache')

## A LRU and expiring cache.
##
## @param size {Number} Max number of entries to cache.
## @param expiry {Number} Number of seconds after which to expire entries.
## @param log {log4js Logger} Optional.
##    All logging is at the Trace level.
## @param name {string} Optional name for this cache. Just used for logging.

class Cache
  constructor: (@size, expiry, @log, name) ->
    @name = if name? then name + ' ' else ''
    @expiry = expiry * 1000
    @items = LRU(@size)

  reset: () ->
    if @log
      @log.trace '%scache reset', @name
    @items.reset()

  get: (key) ->
    assert.ok key != undefined
    cached = @items.get(key)
    if cached
      if ((new Date()).getTime() - cached.ctime) <= @expiry
        if @log
          @log.trace '%scache hit: key="%s": %o', @name, key, cached
        cached.value
    if @log
      @log.trace '%scache miss: key="%s"', @name, key
    null

  set: (key, value) ->
    assert.ok key != undefined
    item = {
      value: value,
      ctime: new Date().getTime()
    }
    if @log
      @log.trace '%scache set: key="%s": %o', @name, key, item
    @items.set(key, item)
    item

  del: (key) ->
    if @log
      @log.trace '%scache del: key="%s"', @name, key
    @items.del(key)

module.exports = Cache
