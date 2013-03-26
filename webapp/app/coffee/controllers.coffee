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
  $scope.gene = Gene.get(
    {gene: $routeParams.gene}, 
    (gene) ->
      $scope.description = gene.data.sections.description.data
  )

@VariantController = ($scope, $routeParams, $timeout, Variant) ->
  $scope.variant = Variant.get({variant: $routeParams.variant}
    (variant) ->
    	$scope.ordered = variant.getOrderedPositions()
  )

@StudyController = ($scope, $routeParams, $timeout, Study) ->
  $scope.study = Study.get(
    {study: $routeParams.study}, 
    (study) ->
  )

@EntityController = ($scope, $routeParams, $timeout, Entity) ->
  $scope.entity = Entity.get(
    {study: $routeParams.study, role: $routeParams.role, identity: $routeParams.identity}, 
    (entity) ->
  )
