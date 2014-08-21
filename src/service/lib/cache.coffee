## Copyright 2014(c) The Ontario Institute for Cancer Research. All rights reserved.
##
## This program and the accompanying materials are made available under the terms of the GNU Public
## License v3.0. You should have received a copy of the GNU General Public License along with this
## program. If not, see <http://www.gnu.org/licenses/>.
##
## THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
## IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
## FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
## CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
## DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
## DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
## WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY
## WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

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
