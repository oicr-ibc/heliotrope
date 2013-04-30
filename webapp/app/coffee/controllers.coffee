#Controllers

#@MyCtrl1 = () ->
#MyCtrl1.$inject = []

#@MyCtrl2 = () ->
#MyCtrl2.$inject = []

@HomeController = ($scope, $routeParams, $timeout, GeneFrequencies) ->
  $scope.gene = GeneFrequencies.get({}, 
    (frequencies) ->
  )

@GeneController = ($scope, $routeParams, $timeout, Gene) ->
  $scope.entity = Gene.get($routeParams
    (entity) ->
      $scope.description = entity.data.sections.description.data
    (error) ->
      console.log error
  )

@VariantController = ($scope, $routeParams, $timeout, Variant) ->
  $scope.entity = Variant.get($routeParams
    (entity) ->
      $scope.ordered = entity.getOrderedPositions()
    (error) ->
      console.log error
  )

@StudyController = ($scope, $routeParams, $timeout, Study) ->
  $scope.study = Study.get($routeParams
    (study) ->

    (error) ->
      console.log error
  )

@EntityController = ($scope, $routeParams, $timeout, Entity) ->
  $scope.entity = Entity.get($routeParams
    (entity) ->

    (error) ->
      console.log error
  )

@EntityStepController = ($scope, $routeParams, $timeout, $location, EntityStep) ->
  console.log "@EntityStepController", $routeParams
  $scope.entity = EntityStep.get($routeParams
    (entityStep) ->
      console.log "Got entity step", entityStep, this
    (error) ->
      console.log error
  )
  
  # This is where the step data is pushed back to the service. 
  $scope.update = (entity) =>
    entity.$save(
      {study: $routeParams.study, role: $routeParams.role, identity: $routeParams.identity, step: $routeParams.step}, 
      (entityStep, responseHeaders) =>
        $location.path(entityStep.data.url).replace()
      (error) ->
        console.log "Error from $save", error
        $scope.error = error
    )
    
@SearchFormController = ($scope, $routeParams, $timeout, $location, Search) ->
  console.log "@SearchFormController", $routeParams, $scope
  $scope.q = '';
  $scope.submit = () ->
    $location.path("search")
    $location.search("q", $scope.q)

@SearchController = ($scope, $routeParams, $timeout, Search) ->
  $scope.search = Search.get($routeParams
    (entity) ->
      console.log "@SearchController", $routeParams, $scope
    (error) ->
      console.log error
  )