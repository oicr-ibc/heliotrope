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
            body = '<label>Comment:<br><textarea class="comment"ng-model="value"></textarea></label>'
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

  .directive('heliEditText', ($compile) ->
    result = 
      restrict: "A"
      replace: true
      transclude: false
      scope: 
        value: '='
      template: '<span></span>'
      link: (scope, iElement, iAttrs, controller) ->
        scope.$parent.$watch 'editing', (editing) ->
          if editing
            body = '<input class="text" ng-model="value"></input>'
            template = angular.element(body)
            linkFn = $compile(template)
            iElement.empty()
            iElement.append linkFn(scope)
          else 
            body = "<span>{{value}}</span>"
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
            iElement.attr("class", "well well-small editing-enabled")
          else 
            iElement.attr("class", "")
  )

  .directive('heliEditableClinicalSignificance', () ->
    result = 
      restrict: "A"
      replace: true
      transclude: true
      template: '<div class="well well-small">' +
                '<label>The clinical significance of this mutation has been assessed by ' +
                '<span heli-edit-dropdown value="significance.studyType" options="prospective,retrospective,preclinical,case,observational,other"></span>' +
                ' clinical trials' +
                '</label>' +
                '<label>' +
                '<div heli-edit-comment value="significance.comment"></div>' +
                '</label>' +
                '<label>Sources: ' +
                '<span heli-edit-references references="significance.reference"></span>' +
                '</label>' +
                '<label>Level of evidence: ' +
                '<span heli-edit-dropdown value="significance.levelOfEvidence" options="IA,IB,IIB,IIC,IIIC,IVD,VD"></span>' +
                ' clinical trials' +
                '</label>' +
                '</div>'
      link: (scope, iElement, iAttrs, controller) ->
        scope.$watch 'editing', (newValue) ->
          if newValue
            iElement.attr("class", "well well-small editing-enabled")
          else 
            iElement.attr("class", "")
        # Watch editing in the scope. When it's enabled, switcheroo stuff. 
  )

  .directive('heliEditableAgents', () ->
    result = 
      restrict: "A"
      replace: true
      transclude: true
      scope: 
        agents: '='
      controller: 'EditableAgentsController'
      template: '<div class="well well-small">' +
                '<div class="row-fluid" ng-hide="agents">' +
                '<p>No information available</p>' +
                '</div>' +
                '<div class="row-fluid" ng-show="agents">' +
                '<div ng-repeat="agent in agents">' +
                '<span class="label-value dropdown-value" heli-edit-dropdown value="agent.sensitivity" options="sensitivity,resistance,maybe_sensitivity,maybe_resistance"></span>: ' +
                '<span class="labelled-value text-value" heli-edit-text value="agent.name"></span>' +
                '<button ng-show="editing" class="btn btn-danger" ng-click="removeDrug(agent)">Remove</button>' +
                '</div>' +
                '<button ng-show="editing" class="btn" ng-click="addDrug()">Add drug</button>' +
                '</div>'
      link: (scope, iElement, iAttrs, controller) ->
        scope.$parent.$watch 'editing', (editing) ->
          scope.editing = editing
          if editing
            iElement.attr("class", "well well-small editing-enabled")
          else 
            iElement.attr("class", "")
  )


