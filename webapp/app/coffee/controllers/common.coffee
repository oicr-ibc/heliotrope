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
