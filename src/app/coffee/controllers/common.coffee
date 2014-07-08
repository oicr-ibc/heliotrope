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
  		$scope.$emit "event:loginRequest", username, password

    $scope.cancelLogin = () ->
      $scope.$emit "event:loginCancelled"

  	$scope.logout = () ->
  		$scope.$emit "event:logoutRequest"
  )

