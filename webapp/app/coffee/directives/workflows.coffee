# Directives 

angular
  .module('heliotrope.directives.workflows', [])

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

