#Controllers

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
      clinical = entity.data.sections.clinical
      if clinical
        # Build a significance type list in the scope we can use to repeat and filter
        # the data accordingly.
        types = {}
        types[sig.tumourType] = [] for sig in clinical.data.significance
        types[sig.tumourType].push(sig) for sig in clinical.data.significance
        $scope.classifiedSignifance = types
        console.log "Scope", $scope
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