angular
  .module('heliotrope.controllers.tracker', [])

  .controller('StudyListController', ($scope, $routeParams, $timeout, StudyList) ->
    $scope.studies = StudyList.get($routeParams
      (study) ->

      (error) ->
        console.log error
    )
  )

  .controller('StudyController', ($scope, $routeParams, $timeout, Study) ->
    $scope.study = Study.get($routeParams
      (study) ->

      (error) ->
        console.log error
    )
  )

  .controller('EntityController', ($scope, $routeParams, $timeout, Entity) ->
    $scope.entity = Entity.get($routeParams
      (entity) ->

      (error) ->
        console.log error
    )
  )

  .controller('EntityStepController', ($scope, $routeParams, $timeout, $location, EntityStep) ->
    $scope.entity = EntityStep.get($routeParams
      (entityStep) ->
        
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
  )
