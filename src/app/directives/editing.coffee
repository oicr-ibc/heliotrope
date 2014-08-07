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
            body = '<p class="form-control-static">' +
                   '<span class="inline-list">' +
                   '<span ng-hide="references">none</span>' +
                   '<span ng-show="references" class="inline-item" ng-repeat="reference in references">' +
                   '<span heli-reference reference="reference"></span> ' +
                   '</span>' +
                   '</span>' +
                   '</p>'
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
            control = linkBody("<select class='select-dropdown form-control' ng-model='value'>" +
                               "<option ng-repeat='alt in options | split' ng-selected='(alt == value)' value='{{alt}}'>{{alt | keywordToString:#{capitalize}}}</option>" +
                               "</select>")
            jQuery(control).select2()
          else
            linkBody("<p class='form-control-static'>{{value | keywordToString:#{capitalize}}}</p>")
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
            body = "<p class='form-control-static'><b>{{value}}</b></p>"
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
            body = '<textarea class="comment form-control" ng-model="value"></textarea>'
            template = angular.element(body)
            linkFn = $compile(template)
            iElement.empty()
            iElement.append linkFn(scope)
          else
            body = "<p class='form-control-static comment'>{{value}}</span>"
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
            body = '<input class="text form-control" ng-model="value"></input>'
            template = angular.element(body)
            linkFn = $compile(template)
            iElement.empty()
            iElement.append linkFn(scope)
          else
            body = "<p class='form-control-static'>{{value}}</p>"
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
      template: '<div ng-class="{\'well well-sm\': editing}" >' +
                '<form class="form-horizontal heli-editing-form" role="form">' +

                '<div class="form-group">' +
                '<label for="actionType{{$index}}" class="col-sm-3 control-label">Mutation action</label>' +
                '<div class="col-sm-9">' +
                '<span heli-edit-dropdown id="actionType{{$index}}" value="action.type" options="activating,inactivating,other"></span>' +
                '</div>' +
                '</div>' +

                '<div class="form-group">' +
                '<label for="actionComment{{$index}}" class="col-sm-3 control-label">Comment</label>' +
                '<div class="col-sm-9">' +
                '<div heli-edit-comment id="actionComment{{$index}}" value="sig.comment"></div>' +
                '</div>' +
                '</div>' +

                '<div class="form-group">' +
                '<label for="actionSources{{$index}}" class="col-sm-3 control-label">References</label>' +
                '<div class="col-sm-9">' +
                '<span heli-edit-references id="actionSources{{$index}}" references="action.reference"></span>' +
                '</div>' +
                '</div>' +

                '</form>' +
                '</div>'
      link: (scope, iElement, iAttrs, controller) ->
        scope.$parent.$watch 'editing', (editing) ->
          scope.editing = editing
          if editing
            iElement.attr("class", "editing-enabled")
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
      template: '<div>' +
                '<p ng-hide="editing || significance">No information available</p>' +
                '<div ng-class="{\'well well-sm\': editing}" ng-repeat="sig in significance">' +
                '<form class="form-horizontal heli-editing-form" role="form">' +

                '<div class="form-group">' +
                '<label for="tumourType{{$index}}" class="col-sm-3 control-label">Tumour type</label>' +
                '<div class="col-sm-9">' +
                '<span heli-edit-text value="sig.tumourType" options="tumourTypes"></span>' +
                '</div>' +
                '</div>' +

                '<div class="form-group">' +
                '<label for="trialType{{$index}}" class="col-sm-3 control-label">Trial type</label>' +
                '<div class="col-sm-9">' +
                '<span heli-edit-dropdown id="trialType{{$index}}" value="sig.studyType" options="prospective,retrospective,preclinical,case,observational,other"></span>' +
                '</div>' +
                '</div>' +

                '<div class="form-group">' +
                '<label for="comment{{$index}}" class="col-sm-3 control-label">Comment</label>' +
                '<div class="col-sm-9">' +
                '<div heli-edit-comment id="comment{{$index}}" value="sig.comment"></div>' +
                '</div>' +
                '</div>' +

                '<div class="form-group">' +
                '<label for="sources{{$index}}" class="col-sm-3 control-label">References</label>' +
                '<div class="col-sm-9">' +
                '<span heli-edit-references id="sources{{$index}}" references="sig.reference"></span>' +
                '</div>' +
                '</div>' +

                '<div class="form-group">' +
                '<label for="levelOfEvidence{{$index}}" class="col-sm-3 control-label">Level of evidence</label>' +
                '<div class="col-sm-9">' +
                '<span heli-edit-dropdown id="levelOfEvidence{{$index}}" value="sig.levelOfEvidence" options="IA,IB,IIB,IIC,IIIC,IVD,VD"></span>' +
                '</div>' +
                '</div>' +

                '<div class="form-group">' +
                '<div class="col-sm-offset-3 col-sm-9">' +
                '<button ng-show="editing" type="submit" class="btn btn-danger">Remove</button>' +
                '</div>' +
                '</div>' +

                '</form>' +
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
            iElement.attr("class", "editing-enabled")
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
      template: '<div>' +
                '<p ng-hide="editing || agents">No information available</p>' +
                '<div ng-class="{\'well well-sm\': editing}" ng-repeat="agent in agents">' +
                '<form class="form-horizontal heli-editing-form" role="form">' +

                '<div class="form-group">' +
                '<label for="agentName{{$index}}" class="col-sm-3 control-label">Agent name</label>' +
                '<div class="col-sm-9">' +
                '<span heli-edit-text id="agentName{{$index}}" value="agent.name"></span>' +
                '</div>' +
                '</div>' +

                '<div class="form-group">' +
                '<label for="agentSensitivity{{$index}}" class="col-sm-3 control-label">Agent sensitivity</label>' +
                '<div class="col-sm-9">' +
                '<span heli-edit-dropdown id="agentSensitivity{{$index}}" value="agent.sensitivity" options="sensitivity,resistance,maybe_sensitivity,maybe_resistance"></span>' +
                '</div>' +
                '</div>' +


                '<div class="form-group">' +
                '<label for="agentComment{{$index}}" class="col-sm-3 control-label">Comment</label>' +
                '<div class="col-sm-9">' +
                '<div heli-edit-comment id="agentComment{{$index}}" value="agent.comment"></div>' +
                '</div>' +
                '</div>' +

                '<div class="form-group">' +
                '<label for="agentReferences{{$index}}" class="col-sm-3 control-label">References</label>' +
                '<div class="col-sm-9">' +
                '<span heli-edit-references id="agentReferences{{$index}}" value="agent.reference"></span>' +
                '</div>' +
                '</div>' +

                '<div class="form-group">' +
                '<div class="col-sm-offset-3 col-sm-9">' +
                '<button ng-show="editing" type="submit" class="btn btn-danger">Remove</button>' +
                '</div>' +
                '</div>' +

                '</form>' +
                '</div>' +

                '<button ng-show="editing" class="btn" ng-click="addDrug()">Add drug</button>' +

                '</div>'
      link: (scope, iElement, iAttrs, controller) ->

        scope.$parent.$watch 'editing', (editing) ->
          scope.editing = editing
          if editing
            iElement.attr("class", "editing-enabled")
          else
            iElement.attr("class", "")
