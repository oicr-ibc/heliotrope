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
            scope.editing = true
          else 
            button.attr("class", "btn")
            button.text("Start editing")
            scope.editing = false
          scope.$digest()
          e.stopPropagation()
          e.preventDefault()
  )

  .directive('heliEditableSignificance', () ->
    result = 
      restrict: "A"
      replace: true
      transclude: true
      template: '<div class="well well-small">' +
                '<p>This mutation is: <b>{{entity.data.sections.clinical.data.action.type}}</b></p>' +
                '<p ng-show="entity.data.sections.clinical.action.comment">{{entity.data.sections.clinical.action.comment}}</p>' +
                '<p>Sources: ' +
                '  <span class="inline-list">' +
                '  <span class="inline-item" ng-repeat="reference in entity.data.sections.clinical.data.action.reference">' +
                '  <span heli-reference reference="reference"></span> ' +
                '  </span>' +
                '  </span>' +
                '</p>' +
                '</div>'
      link: (scope, iElement, iAttrs, controller) ->
        scope.$watch 'editing', (newValue) ->
          console.log newValue
          if newValue
            iElement.attr("class", "well well-small")
          else 
            iElement.attr("class", "")
  )

  .directive('heliEditableClinicalSignificance', () ->
    result = 
      restrict: "A"
      replace: true
      transclude: true
      template: '<div class="well well-small">' +
                '<p>The clinical significance of this mutation has been assessed by <b>{{significance.studyType}}</b> clinical trials.</p>' +
                '<p>{{significance.comment}}</p>' +
                '<p>Sources:' +
                '  <span class="inline-list"">' +
                '  <span class="inline-item" ng-repeat="reference in significance.reference">' +
                '  <span heli-reference reference="reference"></span> ' +
                '  </span>' +
                '  </span>' +
                '  Level of evidence: {{significance.levelOfEvidence}}</p>' +
                '</div>' +
                '</div>'
      link: (scope, iElement, iAttrs, controller) ->
        scope.$watch 'editing', (newValue) ->
          console.log newValue
          if newValue
            iElement.attr("class", "well well-small")
          else 
            iElement.attr("class", "")
        # Watch editing in the scope. When it's enabled, switcheroo stuff. 
  )

  .directive('heliEditableAgent', () ->
    result = 
      restrict: "A"
      replace: true
      transclude: true
      template: '<div class="well well-small">' +
                '<dl style="margin-top: 0px; margin-bottom: 0px; padding-top: 0px; padding-bottom: 0px;">' +
                '  <dt>{{agent.sensitivity | keywordToString}}</dt>' +
                '  <dd>{{agent.name}}</dd>' +
                '</dl>' +
                '</div>'
      link: (scope, iElement, iAttrs, controller) ->
        scope.$watch 'editing', (newValue) ->
          console.log newValue
          if newValue
            iElement.attr("class", "well well-small")
          else 
            iElement.attr("class", "")
  )

