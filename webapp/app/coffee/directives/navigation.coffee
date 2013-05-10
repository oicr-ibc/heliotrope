# Directives 

angular
  .module('heliotrope.directives.navigation', [])

  # Used to generate a dropdown menu of the available workflows. These can then be
  # used to direct to a form on selection. 
  
  .directive('heliWorkflows', () ->
    result = 
      restrict: "A"
      replace: true
      transclude: true
      template: '<ul class="dropdown-menu">' +
                '<li ng-repeat="step in entity.data.availableSteps">' +
                '<a href="{{step.url}}">{{step.label}}</a>' +
                '</li>' +
                '</ul>'
  )
  
  .directive('heliSection', () ->
      priority: 1
      restrict: "A"
      replace: true
      transclude: true
      scope: { title: '@title', id: '@bodyId' }
      template: '<div class="row-fluid">' +
                '<div class="tab-content">' +
                '<div class="tab-pane active">' +
                '<div class="row-fluid">' + 
                '<h3 class="pull-left" id="{{id}}">{{title}}</h3>' +
                '</div>' +
                '<div class="body" ng-transclude></div>' +
                '</div' +
                '</div>'
      link: (scope, iElement, iAttrs, controller) ->
        navElement = jQuery("#sidebar .nav-list")
        id = iAttrs["bodyId"]
        title = iAttrs["title"]
        newElement = jQuery("<li><a class='nav-section' href='#" + id + "'>" + title + "</a></li>")
        newElement.appendTo(navElement)
        newElement.click (e) ->
          e.preventDefault()
          e.stopPropagation()
          target = e.currentTarget.firstChild.getAttribute('href')
          offset = jQuery(target).offset().top - 150
          jQuery("body").animate({scrollTop: offset}, 'slow')
          true
  )
  
