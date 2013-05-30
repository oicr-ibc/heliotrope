angular
  .module('heliotrope.directives.editing', [])

  # When editing is enabled.

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

  .directive('heliReferenceTags', () ->
    result = 
      restrict: "A"
      replace: true
      transclude: false
      scope: 
        references: '='
      template: '<input type="text" class="reference-tags" value=""></input>'
      link: (scope, iElement, iAttrs, controller) ->
        scope.$watch 'references', (references) ->
          
          referenceString = (ref) ->
            ref.type + ":" + ref.id
          tags = references.map(referenceString)

          iElement.val(tags).select2({
            tags: tags,
            tokenSeparators: [",", " "]
          })

          # Now, when we have a change, we need to propogate to the scope.
          iElement.unbind 'change'
          iElement.on 'change', (event) ->
            value = event.val
            scope.references = value.map (value) ->
              keys = value.split(":")
              { type: keys[0], id: keys[1] }
            scope.$digest()
  )

  .directive('heliEditReferences', ($compile) ->
    result = 
      restrict: "A"
      replace: true
      transclude: false
      scope: 
        references: '='
      template: '<span></span>'
      link: (scope, iElement, iAttrs, controller) ->
        scope.$parent.$watch 'editing', (editing) ->
          if editing
            body = '<div heli-reference-tags references="references"><div>'
            template = angular.element(body)
            linkFn = $compile(template)
            iElement.empty()
            iElement.append linkFn(scope)
          else
            body = '<span ng-hide="editing" class="inline-list">' +
                   '<span class="inline-item" ng-repeat="reference in references">' +
                   '<span heli-reference reference="reference"></span> ' +
                   '</span>' +
                   '</span>'
            template = angular.element(body)
            linkFn = $compile(template)
            iElement.empty()
            iElement.append linkFn(scope)
  )

  .directive('heliEditDropdown', ($compile) ->
    result = 
      restrict: "A"
      replace: true
      transclude: false
      scope: 
        value: '='
        options: '@'
      template: '<span></span>'
      link: (scope, iElement, iAttrs, controller) ->
        scope.$parent.$watch 'editing', (editing) ->
          if editing
            body = '<select class="select-dropdown" ng-model="value">' +
                   '<option ng-repeat="alt in options | split" ng-selected="(alt == value)" value="{{alt}}">{{alt}}</option>' +
                   '</select>'
            template = angular.element(body)
            linkFn = $compile(template)
            iElement.empty()
            iElement.append linkFn(scope)
          else 
            body = "<b>{{value}}</b>"
            template = angular.element(body)
            linkFn = $compile(template)
            iElement.empty()
            iElement.append linkFn(scope)
  )

  .directive('heliEditComment', ($compile) ->
    result = 
      restrict: "A"
      replace: true
      transclude: false
      scope: 
        value: '='
      template: '<div></div>'
      link: (scope, iElement, iAttrs, controller) ->
        scope.$parent.$watch 'editing', (editing) ->
          if editing
            body = '<label>Comment:<br><textarea ng-model="value"></textarea></label>'
            template = angular.element(body)
            linkFn = $compile(template)
            iElement.empty()
            iElement.append linkFn(scope)
          else 
            body = "<p>{{value}}</p>"
            template = angular.element(body)
            linkFn = $compile(template)
            iElement.empty()
            iElement.append linkFn(scope)
  )

  .directive('heliEditableSignificance', () ->
    result = 
      restrict: "A"
      replace: true
      transclude: true
      template: '<div class="well well-small">' +
                '<label>This mutation is: ' +
                '<span heli-edit-dropdown value="entity.data.sections.clinical.data.action.type" options="activating,inactivating,other"></span>' +
                '</label>' +
                '<label>' +
                '<div heli-edit-comment value="entity.data.sections.clinical.action.comment"></div>' +
                '</label>' +
                '<label>Sources: ' +
                '<span heli-edit-references references="entity.data.sections.clinical.data.action.reference"></span>' +
                '</label>' +
                '</div>'
      link: (scope, iElement, iAttrs, controller) ->
        scope.$watch 'editing', (editing) ->
          if editing
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

