angular
  .module 'heliotrope.directives.editing', []

  .directive 'heliEditReferences', ['$compile', ($compile) ->
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

            body = '<input type="text" class="reference-tags" value=""></input>'
            iElement.empty()
            iElement.append(jQuery(body))

            changeHandler = (evt) ->
              value = evt.val
              if value?
                scope.$apply () ->
                  scope.references = value.map (value) ->
                    keys = value.split(":")
                    { type: keys[0], id: keys[1] }

            tagsElement = iElement.find(".reference-tags")
            tagsElement.select2(
              tags: []
              tokenSeparators: [",", " "]
            )
            tagsElement.bind 'change', changeHandler

            # Establish a watcher to write values into the tags editor
            scope.$watch 'references', (references) ->

              references ||= []
              referenceString = (ref) ->
                ref.type + ":" + ref.id
              tags = references.map(referenceString)

              if ! angular.equals(tags, tagsElement.val().split(","))
                tagsElement.val(tags).trigger('change')

          else
            body = '<span ng-hide="editing" class="inline-list">' +
                   '<span ng-hide="references">none</span>' +
                   '<span ng-show="references" class="inline-item" ng-repeat="reference in references">' +
                   '<span heli-reference reference="reference"></span> ' +
                   '</span>' +
                   '</span>'
            template = angular.element(body)
            linkFn = $compile(template)
            iElement.empty()
            iElement.append linkFn(scope)
  ]

  .directive 'heliEditDropdown', ['$compile', ($compile) ->
    result =
      restrict: "A"
      replace: true
      transclude: false
      scope:
        value: '='
        options: '@'
      template: '<span></span>'
      link: (scope, iElement, iAttrs, controller) ->
        capitalize = iAttrs["capitalize"] == "true"

        linkBody = (body) ->
          template = angular.element(body)
          linked = $compile(template)(scope)
          iElement.empty()
          iElement.append linked
          linked

        scope.$parent.$watch 'editing', (editing) ->
          if editing
            linkBody("<select class='select-dropdown' ng-model='value'>" +
                     "<option ng-repeat='alt in options | split' ng-selected='(alt == value)' value='{{alt}}'>{{alt | keywordToString:#{capitalize}}}</option>" +
                     "</select>")
          else
            linkBody("<span>{{value | keywordToString:#{capitalize}}}</span>")
  ]

  .directive 'heliEditTypeahead', ['$compile', ($compile) ->
    result =
      restrict: "A"
      replace: true
      transclude: false
      scope:
        value: '='
        options: '&'
      template: '<span></span>'
      link: (scope, iElement, iAttrs, controller) ->
        scope.$parent.$watch 'editing', (editing) ->
          if editing
            body = '<input class="input-typeahead" ng-model="value" type="text"></input>'
            template = angular.element(body)
            linkFn = $compile(template)
            iElement.empty()
            iElement.append linkFn(scope)
            options = scope.options()
            typeahead = iElement.find(".input-typeahead")
            typeahead.typeahead({source: options})
            typeahead.on 'blur', (event) ->
              console.log "Blur", event
            typeahead.on 'change', (event) ->
              console.log "Change", event

          else
            body = "<b>{{value}}</b>"
            template = angular.element(body)
            linkFn = $compile(template)
            iElement.empty()
            iElement.append linkFn(scope)
  ]

  .directive 'heliEditComment', ['$compile', ($compile) ->
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
            body = '<textarea class="comment" ng-model="value"></textarea>'
            template = angular.element(body)
            linkFn = $compile(template)
            iElement.empty()
            iElement.append linkFn(scope)
          else
            body = '<span class="comment">{{value}}</span>'
            template = angular.element(body)
            linkFn = $compile(template)
            iElement.empty()
            iElement.append linkFn(scope)
  ]

  .directive 'heliEditText', ['$compile', ($compile) ->
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
  ]

  .directive 'heliEditableAction', () ->
    result =
      restrict: "A"
      replace: true
      transclude: true
      scope:
        action: '='
      template: '<div class="well well-small">' +
                '<dl class="dl-horizontal">' +
                '<dt>Mutation action</dt>' +
                '<dd>' +
                '<span ng-show="editing"><span heli-edit-dropdown value="action.type" options="activating,inactivating,other"></span></span>' +
                '<span ng-hide="editing">{{action.type || &quot;unknown&quot;}}</span>' +
                '</dd>' +
                '<dt ng-show="editing || action.comment">Comment</dt>' +
                '<dd ng-show="editing || action.comment"><div heli-edit-comment value="action.comment"></div></dd>' +
                '<dt>Sources</dt>' +
                '<dd><span heli-edit-references references="action.reference"></span></dd>' +
                '</dl>' +
                '</div>'
      link: (scope, iElement, iAttrs, controller) ->
        scope.$parent.$watch 'editing', (editing) ->
          scope.editing = editing
          if editing
            iElement.attr("class", "well well-small editing-enabled")
          else
            iElement.attr("class", "")

  .directive 'heliEditableSignificances', () ->
    result =
      restrict: "A"
      replace: true
      transclude: true
      scope:
        significance: '='
      controller: 'EditableSignificanceController'
      template: '<div class="well well-small">' +
                '<p ng-hide="editing || significance">No information available</p>' +
                '<div ng-repeat="sig in significance">' +
                '<dl class="dl-horizontal">' +
                '<dt>Tumour type</dt>' +
                '<dd>' +
                '<span heli-edit-typeahead value="sig.tumourType" options="tumourTypes"></span>' +
                '<button ng-show="editing" class="btn btn-danger" ng-click="removeSignificance(sig)">Remove</button>' +
                '</dd>' +
                '<dt>Trial types</dt>' +
                '<dd>' +
                '<span heli-edit-dropdown value="sig.studyType" options="prospective,retrospective,preclinical,case,observational,other"></span>' +
                '</dd>' +
                '<dt>Comment</dt>' +
                '<dd>' +
                '<div heli-edit-comment value="sig.comment"></div>' +
                '</dd>' +
                '<dt>Sources</dt>' +
                '<dd><span heli-edit-references references="sig.reference"></span></dd>' +
                '<dt>Level of evidence</dt>' +
                '<dd><span heli-edit-dropdown value="sig.levelOfEvidence" options="IA,IB,IIB,IIC,IIIC,IVD,VD"></span><dd>' +
                '</dl>' +
                '</div>' +
                '<button ng-show="editing" class="btn" ng-click="addSignificance()">Add study</button>' +
                '</div>'
      link: (scope, iElement, iAttrs, controller) ->

        # Need data for the significances that isn't going to be affected by the model changes.
        # This allows the display to remain unmodified during most of the editing
        # process. If we don't do this, every edit to the tumourType field modifies
        # the model and triggers a redisplay we don't actually want. We also really want a
        # stable set of tumour types we can use for typeahead in a dropdown, but we can
        # pull that from the server. The easiest way to achieve that is to ignore the tumourType as
        # a filtering system, and just display significances in order. That order can be adjusted by
        # business logic, but again we don't want that to change live if we can help it, as that
        # would mess up the display.
        watcher = scope.$watch 'significance', (significance) ->
          if significance && ! scope.tumourTypes
            watcher()
            classified = {}
            for element in significance
              classified[element["tumourType"]] = element
            scope.tumourTypes = Object.keys(classified)

        scope.$parent.$watch 'editing', (editing) ->
          scope.editing = editing
          if editing
            iElement.attr("class", "well well-small editing-enabled")
          else
            iElement.attr("class", "")


  .directive 'heliEditableAgents', () ->
    result =
      restrict: "A"
      replace: true
      transclude: true
      scope:
        agents: '='
      controller: 'EditableAgentsController'
      template: '<div class="well well-small">' +
                '<div class="row-fluid" ng-hide="editing || agents">' +
                '<p>No information available</p>' +
                '</div>' +
                '<div class="row-fluid" ng-show="editing || agents">' +
                '<div ng-show="agents" class="heli-dl dl-horizontal">' +
                '<div ng-repeat="agent in agents">' +
                '<div class="heli-dt"><span class="label-value dropdown-value" heli-edit-dropdown capitalize="true" value="agent.sensitivity" options="sensitivity,resistance,maybe_sensitivity,maybe_resistance"></span></div>' +
                '<div class="heli-dd"><span class="labelled-value text-value" heli-edit-text value="agent.name"></span>' +
                '<button ng-show="editing" class="btn btn-danger" ng-click="removeDrug(agent)">Remove</button></div>' +
                '</div>' +
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
