angular
  .module('heliotrope.controllers.common', [])

  .controller('NavigationController', ($scope, $routeParams, $timeout, StudyList) ->

    $scope.studiesAvailable = false

    $scope.studies = StudyList.get(
      {}
      () -> $scope.studiesAvailable = true
      () -> 
    )
  )

  .controller('AuthenticationController', ($scope, $routeParams, $timeout, StudyList) ->

  	$scope.username = undefined
  	$scope.password = undefined

  	$scope.login = (username, password) ->
  		console.log "Sending login request", username, password
  		$scope.$emit "event:loginRequest", username, password

    $scope.cancelLogin = () ->
      console.log "Sending login request"
      $scope.$emit "event:loginCancelled"

  	$scope.logout = () ->
  		console.log "Sending logout request"
  		$scope.$emit "event:logoutRequest"
  )
