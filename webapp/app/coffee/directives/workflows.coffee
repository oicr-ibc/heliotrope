# Directives 

angular
  .module('heliotrope.directives.workflows', [])

  .directive('heliStepForm', () ->
    result =
      restrict: 'A',
      replace: true,
      transclude: true,
      template: '<div>' +
                '<form class="form-horizontal">' +
                '<div class="body" ng-transclude></div>' +
                '<div class="control-group">' +
                '<div class="controls">' +
                '<button type="submit" class="btn btn-primary submit" ng-click="update(entity)">Save</button>' +
                '</div>' +
                '</div>' +
                '</form>' +
                '<pre>form = {{entity.data.step | json}}</pre>' +
                '</div>'
  )
  
  .directive('heliChooseStep', () ->
    result =
      restrict: "A"
      replace: true
      transclude: true
      template: '<form>' +
                '<div class="control-group">' +
                '<label class="control-label" for="apply-workflow">Apply step</label>' +
                '<div class="controls">' +
                '<div class="btn-group">' +
                '<a class="btn dropdown-toggle" data-toggle="dropdown">Choose step <b class="caret"></b></a>' +
                '<div heli-workflows></div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</form>'
  )

