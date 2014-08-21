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

## Heliotrope responders -- shared by tracker and knowledge base

module.exports.log4js = module.parent.exports.log4js
module.exports.logger = module.parent.exports.logger
module.exports.config = module.parent.exports.config

logger = module.exports.logger

module.exports.sendViewResponse = (req, res, view) ->
  (db, err, doc, res, statusCode) ->
    statusCode = 400 if ! statusCode?
    if err
      res.header 'Content-Type', 'application/json'
      logger.error "Error body", err
      res.status(statusCode).send {error: err, body: doc}
    else
      doc["data"]["serviceUrl"] = req.url
      doc["data"]["config"] = res.locals.config if res.locals.config?
      res.render view, doc
    db.close()

module.exports.sendGetResponse = (req, res) ->
  (db, err, doc, res, statusCode) ->
    statusCode = 400 if ! statusCode?
    if err
      res.header 'Content-Type', 'application/json'
      logger.error "Error body", err
      res.send statusCode, {error: err, body: doc}
    else
      res.header 'Content-Type', 'application/json'
      doc["data"]["serviceUrl"] = req.url
      doc["data"]["config"] = res.locals.config if res.locals.config?
      res.status(statusCode).send doc
    db.close()

module.exports.sendPostResponse = (req, res) ->
  (db, err, url, res, statusCode) ->
    statusCode = 404 if ! statusCode?
    if err
      logger.error "Error body", err
      res.send statusCode, {error: err, url: url}
    else
      res.redirect res.locals.uriBase + url
    db.close()
