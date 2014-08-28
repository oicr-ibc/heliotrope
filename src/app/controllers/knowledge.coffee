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

angular
  .module 'heliotrope.controllers.knowledge', [
    'heliotrope.services.knowledge'
  ]

  .controller 'HomeController', ['$scope', '$routeParams', 'GeneFrequencies', ($scope, $routeParams, GeneFrequencies) ->
    $scope.gene = GeneFrequencies.get({},
      (frequencies) ->
    )
  ]

  .controller 'GeneController', ['$scope', '$routeParams', '$http', 'Gene', ($scope, $routeParams, $http, Gene) ->

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
  ]

  .controller 'VariantController', ['$scope', '$routeParams', '$http', 'Variant', ($scope, $routeParams, $http, Variant) ->

    addData = (url, options, callback) ->
      $http {method: 'GET', url: url, params: options}
        .success (data, status, headers, config) ->
          callback null, data
        .error (data, status, headers, config) ->
          callback status, data

    # Store a copy of the original data here
    # $scope.originalSections = undefined

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

      (error) ->
        console.log error
    )

    # Copy back the original data, assuming we have it
    $scope.reset = () ->
      if $scope.originalSections
        $scope.entity.data.sections = angular.copy($scope.originalSections)

    $scope.startEditing = () ->
      $scope.editing = true

    $scope.cancelChanges =  () ->
      $scope.reset()
      $scope.editing = false

    $scope.saveChanges = () ->
      $scope.entity.$save()
      $scope.editing = false
  ]

  .controller 'PublicationController', ['$scope', '$routeParams', 'Publication', ($scope, $routeParams, Publication) ->
    $scope.entity = Publication.get($routeParams
      (entity) ->

      (error) ->
        console.log error
    )
  ]

  .controller 'EditableAgentsController', ['$scope', '$routeParams', ($scope, $routeParams, $timeout) ->
    $scope.addDrug = () ->
      if ! $scope.agents?
        $scope.agents = []
      $scope.agents.push({sensitivity: "", name: ""})
    $scope.removeDrug = (agent) ->
      $scope.agents = $scope.agents.filter (other) ->
        other.name != agent.name || other.sensitivity != agent.sensitivity
  ]

  .controller 'EditableSignificanceController', ['$scope', '$routeParams', 'Variant', ($scope, $routeParams, Variant) ->
    $scope.addSignificance = () ->
      if ! $scope.significance?
        $scope.significance = []
      $scope.significance.push({tumourType: "", studyType: "", comment: "", reference: [], levelOfEvidence: ""})
    $scope.removeSignificance = (significance) ->
      $scope.significance = $scope.significance.filter (other) ->
        other != significance
  ]

  .controller 'SearchFormController', ['$scope', '$routeParams', '$location', 'Search', ($scope, $routeParams, $location, Search) ->
    $scope.q = '';
    $scope.submit = () ->
      $location.path("search")
      $location.search("q", $scope.q)
  ]

  .controller 'SearchController', ['$scope', '$routeParams', 'Search', ($scope, $routeParams, Search) ->
    $scope.search = Search.get($routeParams
      (entity) ->

      (error) ->

    )
  ]