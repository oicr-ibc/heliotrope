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


Knowledge base service
----------------------

Knowledge service implementation. The primary export from this is a router that can be
connected into the express server with the right URL prefix.

    log4js = require('log4js')
    logger = log4js.getLogger('knowledgeService')

    app = require('./application')
    config = app.locals.config
    base = config["heliotrope"]["knowledgeUriBase"]

    temp =            require('temp')
    fs =              require("fs")

    MongoClient =     require("mongodb").MongoClient

    ## Knowledge service implementation. Nothing much to see here, move along please.
    authentication =  require("./authentication")
    knowledge =       require("./knowledgeImplementation")


A useful log message to show that the knowledge base is being used. In principle, it
could be omitted.

    logger.info("Initializing knowledge base at: " + base)

    router = require('express').Router()


Add middleware to open a database connection, and clean up afterwards

    router.use (req, res, next) =>
      # Allow bypass on content negotiation when the mimeType query parameter is set

      if req.query.mimeType?
        req.headers.accept = req.query.mimeType
        delete req.query.mimeType

      originalEnd = res.end
      res.end = (chunk, encoding) ->
        res.end = originalEnd
        res.end(chunk, encoding)
        if res.locals.db?
          res.locals.db.close()

      res.locals.config = config["heliotrope"]
      res.locals.uriBase = base

      MongoClient.connect config['data']['knowledge']['store']['url'], (err, db) ->
        return next(err) if err?
        res.locals.db  = db
        next()


Here are the main endpoints. The actual implementations are in a separate module
for convenience.

    router.get '/genes/:gene', knowledge.getGene

    router.get '/genes/:gene/mutations', knowledge.getGeneMutations

    router.get '/genes/:gene/frequencies', knowledge.getGeneFrequencies

    router.get '/queries/:query', knowledge.executeQuery

    router.get '/variants/:id', knowledge.getVariant

    router.get '/variants/:id/frequencies', knowledge.getVariantFrequencies

    router.get '/variants/:id/report', knowledge.getVariantReport

    router.get '/genes/:gene/annotation', knowledge.getGeneAnnotation

    router.get '/variants/:id/annotation', knowledge.getVariantAnnotation

    router.get '/publications/:type/:id', knowledge.getPublication

    router.get '/tags', knowledge.getTags

    router.get '/search', knowledge.executeSearch


PUT requests require authentication, and properly authorization too.

    router.put '/variants/:id/annotation', authentication.accessAuthenticator(), knowledge.putVariantAnnotation


POST requests also require authentication, and properly authorization too. This is
not public, as it is primarily a service endpoint that can be used create a
bunch of variants from, e.g., VCF file parsing. The POST system needs to be
idempotent and accessible over web access.

    router.post '/variants', authentication.apiAuthenticator(), knowledge.postVariant


Any other accesses within this part of the API returns a 404 error.

    router.get '/*', (req, res) ->
      res.send(404)


Finally export the router.

    module.exports = router
