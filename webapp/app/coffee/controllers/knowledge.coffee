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

  .controller('EditableAgentsController', ($scope, $routeParams, $timeout) ->
    $scope.addDrug = () ->
      $scope.agents.push({sensitivity: "", name: ""})
    $scope.removeDrug = (agent) ->
      $scope.agents = $scope.agents.filter (other) ->
        other.name != agent.name || other.sensitivity != agent.sensitivity
  )

  .controller('EditableSignificanceController', ($scope, $routeParams, $timeout, Variant) ->

  ) 

  .controller('VariantController', ($scope, $routeParams, $timeout, Variant) ->
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
      (error) ->
        console.log error
    )
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