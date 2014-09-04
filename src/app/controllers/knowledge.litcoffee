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


Knowledge controllers
---------------------

This module provides the controllers for the knowledge base.

    angular
      .module 'heliotrope.controllers.knowledge', [
        'heliotrope.services.knowledge'
      ]


The controller for the home page of the knowledge base, which displays a set of gene frequencies.

      .controller 'HomeController', Array '$scope', '$routeParams', 'GeneFrequencies', ($scope, $routeParams, GeneFrequencies) ->
        $scope.gene = GeneFrequencies.get({},
          (frequencies) ->
        )


The controller for a gene page display.

      .controller 'GeneController', Array '$scope', '$routeParams', '$http', 'Gene', ($scope, $routeParams, $http, Gene) ->

        addData = (url, options, callback) ->
          $http {method: 'GET', url: url, params: options}
            .success (data, status, headers, config) ->
              callback null, data
            .error (data, status, headers, config) ->
              callback status, data

        $scope.entity = Gene.get($routeParams
          (entity) ->
            $scope.description = entity.data.sections.description.data

            addData entity.data.mutationsUrl, {limit: 10}, (err, mutationsData) ->
              if ! err?
                for m in mutationsData.data
                  m.selected = true
                $scope.mutations = mutationsData

            addData entity.data.frequenciesUrl, {}, (err, frequenciesData) ->
              if ! err?
                $scope.frequencies = frequenciesData

            addData entity.data.annotationUrl, {}, (err, annotationData) ->
              if ! err?
                $scope.annotation = annotationData

          (error) ->
            console.log error
        )


The controller for a variant page display. This allows allows editing of annotations, and contains the
actions needed to write these annotations back into the knowledge base.

      .controller 'VariantController', Array '$scope', '$routeParams', '$http', 'Variant', ($scope, $routeParams, $http, Variant) ->

        addData = (url, options, callback) ->
          $http {method: 'GET', url: url, params: options}
            .success (data, status, headers, config) ->
              callback null, data
            .error (data, status, headers, config) ->
              callback status, data

        # Store a copy of the original anotation data here
        $scope.originalAnnotations = undefined

        $scope.entity = Variant.get($routeParams
          (entity) ->
            $scope.ordered = entity.getOrderedPositions()

            addData entity.data.geneUrl, {}, (err, geneData) ->
              if ! err?
                $scope.geneTranscripts = geneData.data.sections.transcripts

            addData entity.data.mutationsUrl, {}, (err, mutationsData) ->
              if ! err?
                for m in mutationsData.data
                  m.selected = (m.name == entity.data.mutation)
                $scope.mutations = mutationsData

            addData entity.data.frequenciesUrl, {}, (err, frequenciesData) ->
              if ! err?
                $scope.frequencies = frequenciesData

            addData entity.data.annotationUrl, {}, (err, annotationData) ->
              if ! err?
                $scope.annotation = annotationData
                $scope.originalAnnotations = angular.copy(annotationData) || {}

          (error) ->
            console.log error
        )

        # Copy back the original data, assuming we have it
        $scope.reset = () ->
          if $scope.originalAnnotations
            $scope.annotation = angular.copy($scope.originalAnnotations)

        $scope.startEditing = () ->
          $scope.editing = true

        $scope.cancelChanges =  () ->
          $scope.reset()
          $scope.editing = false

        $scope.saveChanges = () ->
          $http {method: 'PUT', url: $scope.entity.data.annotationUrl, data: $scope.annotation}
            .success (annotationData, status, headers, config) ->
              $scope.annotation = annotationData
              $scope.originalAnnotations = angular.copy(annotationData) || {}
            .error (data, status, headers, config) ->

          $scope.editing = false


The controller for a publication page display.

      .controller 'PublicationController', Array '$scope', '$routeParams', 'Publication', ($scope, $routeParams, Publication) ->
        $scope.entity = Publication.get($routeParams
          (entity) ->

          (error) ->
            console.log error
        )

The controller for the search form, which handles the search request.

      .controller 'SearchFormController', Array '$scope', '$routeParams', '$location', 'Search', ($scope, $routeParams, $location, Search) ->
        $scope.q = '';
        $scope.submit = () ->
          $location.path("search")
          $location.search("q", $scope.q)


The controller for the search results, which handles the display of search results.

      .controller 'SearchController', Array '$scope', '$routeParams', 'Search', ($scope, $routeParams, Search) ->
        $scope.search = Search.get($routeParams
          (entity) ->

          (error) ->

        )
