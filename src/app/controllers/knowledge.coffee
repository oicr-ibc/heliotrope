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
    $scope.originalSections = undefined

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

        clinical = entity.data.sections.clinical
        if clinical
          # Build a significance type list in the scope we can use to repeat and filter
          # the data accordingly.
          significance = clinical.data.significance
          significance ?= []
          types = {}
          types[sig.tumourType] = [] for sig in significance
          types[sig.tumourType].push(sig) for sig in significance
          $scope.classifiedSignifance = types

        $scope.originalSections = angular.copy(entity.data.sections) || {}
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