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
                '<p ng-hide="editing">This mutation is: ' +
                '<b>{{entity.data.sections.clinical.data.action.type}}</b>' + 
                '</p>' +
                '<label ng-show="editing" >This mutation is: ' +
                '<select class="select-dropdown" ng-model="entity.data.sections.clinical.data.action.type">' +
                '<option>activating</option>' +
                '<option>inactivating</option>' +
                '<option>other</option>' +
                '</select>' +
                '</label>' +
                '<p ng-show="entity.data.sections.clinical.action.comment">{{entity.data.sections.clinical.action.comment}}</p>' +
                '<p>Sources: ' +
                '  <span ng-hide="editing" class="inline-list">' +
                '  <span class="inline-item" ng-repeat="reference in entity.data.sections.clinical.data.action.reference">' +
                '  <span heli-reference reference="reference"></span> ' +
                '  </span>' +
                '  </span>' +
                '  <input ng-show="editing" type="text" value="{{entity.data.sections.clinical.data.action.reference}}">' +
                '</p>' +
                '</div>'
      link: (scope, iElement, iAttrs, controller) ->
        iElement.find("select").selectBoxIt({theme: "bootstrap", copyClasses: "container"})
        scope.$watch 'editing', (newValue) ->
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
          if newValue
            iElement.attr("class", "well well-small")
          else 
            iElement.attr("class", "")
  )

