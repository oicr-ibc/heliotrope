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
  $scope.gene = Gene.get($routeParams
    (gene) ->
      $scope.description = gene.data.sections.description.data
    (error) ->
      console.log error
  )

@VariantController = ($scope, $routeParams, $timeout, Variant) ->
  $scope.variant = Variant.get($routeParams
    (variant) ->
      $scope.ordered = variant.getOrderedPositions()
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
      
    (error) ->
      console.log error
  )
  $scope.update = (entity) =>
    entity.$save(
      {study: $routeParams.study, role: $routeParams.role, identity: $routeParams.identity, step: $routeParams.step}, 
      (entityStep, responseHeaders) =>
        $location.path(entityStep.data.url).replace()
      (error) ->
        console.log error
    )
