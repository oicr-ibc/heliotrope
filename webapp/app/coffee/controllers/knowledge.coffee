angular
  .module('heliotrope.controllers.knowledge', [])

  .controller('HomeController', ($scope, $routeParams, $timeout, GeneFrequencies) ->
    $scope.gene = GeneFrequencies.get({}, 
      (frequencies) ->
    )
  )

  .controller('GeneController', ($scope, $routeParams, $timeout, Gene) ->
    $scope.entity = Gene.get($routeParams
      (entity) ->
        $scope.description = entity.data.sections.description.data
      (error) ->
        console.log error
    )
  )

  .controller('PublicationController', ($scope, $routeParams, $timeout, Publication) ->
    console.log('PublicationController')
    $scope.entity = Publication.get($routeParams
      (entity) ->
        
      (error) ->
        console.log error
    )
  )

  .controller('EditableAgentsController', ($scope, $routeParams, $timeout) ->
    $scope.addDrug = () ->
      if ! $scope.agents?
        $scope.agents = []
      $scope.agents.push({sensitivity: "", name: ""})
    $scope.removeDrug = (agent) ->
      $scope.agents = $scope.agents.filter (other) ->
        other.name != agent.name || other.sensitivity != agent.sensitivity
  )

  .controller('EditableSignificanceController', ($scope, $routeParams, $timeout, Variant) ->
    $scope.addSignificance = () ->
      if ! $scope.significance?
        $scope.significance = []
      $scope.significance.push({tumourType: "", studyType: "", comment: "", reference: [], levelOfEvidence: ""})
    $scope.removeSignificance = (significance) ->
      $scope.significance = $scope.significance.filter (other) ->
        other != significance
  ) 

  .controller('VariantController', ($scope, $routeParams, $timeout, Variant) ->

    # Store a copy of the original data here
    $scope.originalSections = undefined

    $scope.entity = Variant.get($routeParams
      (entity) ->
        $scope.ordered = entity.getOrderedPositions()
        clinical = entity.data.sections.clinical
        if clinical
          # Build a significance type list in the scope we can use to repeat and filter
          # the data accordingly.
          types = {}
          types[sig.tumourType] = [] for sig in clinical.data.significance
          types[sig.tumourType].push(sig) for sig in clinical.data.significance
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
  )

  .controller('SearchFormController', ($scope, $routeParams, $timeout, $location, Search) ->
    $scope.q = '';
    $scope.submit = () ->
      $location.path("search")
      $location.search("q", $scope.q)
  )

  .controller('SearchController', ($scope, $routeParams, $timeout, Search) ->
    $scope.search = Search.get($routeParams
      (entity) ->
        console.log "@SearchController", $routeParams, $scope
      (error) ->
        console.log error
    )
  )