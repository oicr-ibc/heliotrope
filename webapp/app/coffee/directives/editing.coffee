angular
  .module('heliotrope.directives.editing', [])

  .directive('heliEditButton', () ->
    result = 
      restrict: "A"
      replace: true
      transclude: true
      template: '<a class="btn">Start editing</a>'
      link: (scope, iElement, iAttrs, controller) ->
        iElement.on 'click', (e) ->
          button = jQuery(e.delegateTarget)
          if button.attr("class") == "btn"
            button.attr("class", "btn btn-danger")
            button.text("Stop editing")
          else 
            button.attr("class", "btn")
            button.text("Start editing")
          e.stopPropagation()
          e.preventDefault()
  )

