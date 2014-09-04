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

Knowledge base services
-----------------------

A module for knowledge base services, most of which are resources based on
`ngResource`.

    angular.module('heliotrope.services.knowledge', ['ngResource'])


Service to access the gene frequencies. This doens't want any parameters or
or routing usually, it's all global.

      .factory 'GeneFrequencies', Array '$resource', ($resource) ->
        $resource '/api/knowledge/queries/gene_frequencies', {},
          query:
            method: 'GET'


Service to retrieve gene information.

      .factory 'Gene', Array '$resource', ($resource) ->
        $resource '/api/knowledge/genes/:gene', {},
          query:
            method: 'GET'


Service to retrieve search information.

      .factory 'Search', Array '$resource', ($resource) ->
        $resource '/api/knowledge/search', {},
          query:
            method: 'GET'


Service to retrieve publication information.

      .factory 'Publication', Array '$resource', ($resource) ->
        $resource '/api/knowledge/publications/:type/:id', {},
          query:
            method: 'GET'


Service to retrieve variant information. The service allows variants to be
saved and created too. It's unlikely we'll ever use the POST requests
and the service may well not expose them. PUT is normal for saving, as
we want the body back (and we're using JS anyway) and the body will be
used to redisplay.

      .factory 'Variant', Array '$resource', ($resource) ->

        Variant = $resource '/api/knowledge/variants/:name', {name: "@data.name"},
          query:
            method: 'GET'
          save:
            method: 'PUT'
          create:
            method: 'POST'

        Variant.prototype.getOrderedPositions = () ->
          positions = @data.sections.positions.data
          positions.forEach (a) ->
            a.codon = null if a.codon == "-"
          positions.sort (a, b) ->
            result = 0
            result = -1 if ("sift" in a and ! "sift" in b)
            result = 1 if ("sift" in b and ! "sift" in a)
            return result if (result != 0)
            result = -1 if ("polyphen" in a and ! "polyphen" in b)
            result = 1 if ("polyphen" in b and ! "polyphen" in a)
            return result if (result != 0)
            result = Math.max(-1, Math.min(1, a.HGVSc.length - b.HGVSc.length))
            return result
          positions

        Variant
