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

## Bridging to Apache FOP and reporting goodness. This allows a subset of HTML to be
## transformed into a PDF stream that we can send back to the client. It's a pain having
## to do this in Java, but we should have an API that means it can be swapped for something
## a little more sophisticated at some later stage.
##
## This was a good bit easier in Grails, where we could manage the dependencies so
## much better.

module.exports.log4js = module.parent.exports.log4js
module.exports.logger = module.parent.exports.logger
module.exports.config = module.parent.exports.config

fs = require('fs')
glob = require('glob')
spawn = require('child_process').spawn

logger = module.exports.logger
config = module.exports.config

## Note that this does depend on Java, and on having headless support. This is not
## totally trivial, but there is nothing in node.js capable of building that kind of
## PDF generation yet. PDFs can be generated, but it is basically code at a much lower
## level. This is a standard mechanism (XSL-FO) that can be maintained and adapted
## more easily.

module.exports.generatePdf = (filename, callback) ->
  jarfile = config['report']['fop']
  glob config['report']['classpath'], (err, files) ->
    files.push(jarfile)
    classpath = files.join(":")
    commandOptions = ['-Xmx512M', '-Djava.awt.headless=true', '-classpath', classpath, 'org.apache.fop.cli.Main']
    commandOptions.push('-xml', filename);
    commandOptions.push('-pdf', '-');
    commandOptions.push('-xsl', config['report']['xsl']);

    logger.info("Executing: " + "java" + " " + commandOptions.join(" "))

    prc = spawn('java',  commandOptions)

    prc.stderr.on 'data', (data) -> process.stderr.write(data.toString())

    prc.on 'close', (code) ->
      if code != 0
        callback code, null

    callback null, prc.stdout
