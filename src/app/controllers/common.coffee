angular
  .module 'heliotrope.controllers.common', [
    'heliotrope.services.tracker'
  ]

  .controller 'NavigationController', ['$scope', 'StudyList', ($scope, StudyList) ->

    $scope.studiesAvailable = false

    $scope.studies = StudyList.get(
      {}
      () -> $scope.studiesAvailable = true
      () ->
    )
  ]

  .controller 'AuthenticationController', ['$scope', ($scope) ->

    $scope.username = undefined
    $scope.password = undefined

    $scope.login = (username, password) ->
      ## console.log "Calling event:loginRequest with #{username} and #{password}"
      $scope.$emit "event:loginRequest", username, password

    $scope.cancelLogin = () ->
      $scope.$emit "event:loginCancelled"

    $scope.logout = () ->
      $scope.$emit "event:logoutRequest"
  ]

