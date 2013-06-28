# Directives 

angular
  .module('heliotrope.directives.admin', [])

  .directive('heliAdminRange', () ->
    result =
      restrict: "A"
      replace: true
      scope:
        range: '='
      template: '<input type="text"></input>'
      link: (scope, iElement, iAttrs) ->

        changeHandler = (evt) ->
          value = evt.val
          if value?
            scope.$apply () ->
              scope.range = value

        iElement.select2(
          tags: []
          tokenSeparators: [","]
        )
        iElement.bind 'change', changeHandler

        scope.$watch 'range', (range) ->
          range ||= []
          if ! angular.equals(range, iElement.val().split(","))
            iElement.val(range).trigger('change')
  )

  .directive('heliAdminFieldBody', () ->
    result =
      restrict: "A"
      replace: true
      transclude: true
      template: '<div class="field-editor">' +
                '<p><label>Field key</label>' +
                '<input type="text" ng-model="field.key"></p>' +
                '<p><label>Field label</label>' +
                '<input type="text" ng-model="field.label.default"></p>' +
                '<p><label>Field type</label>' +
                '<select ng-model="field.type" ng-options="c for c in fieldTypes"></select></p>' +
                '<p><label>Control type</label>' +
                '<select ng-model="field.controlType" ng-options="c for c in controlTypes"></select></p>' +
                '<p><label class="checkbox">' +
                '<input type="checkbox" ng-model="field.isRequired"> Required' +
                '</label></p>' +
                '<p ng-show="field.controlType == &quot;identity&quot;"><label class="checkbox">' +
                '<input type="checkbox" ng-model="field.isIdentity"> Identity</p>' +
                '<div ng-show="field.controlType == &quot;select&quot;"><p heli-admin-range range="field.range"></p></div>' +
                '</div>'
  )

  .directive('heliAdminField', () ->
    result =
      restrict: "A"
      replace: true
      transclude: true
      template: '<div class="accordion-group">' +
                '<div class="accordion-heading">' +
                '<a class="accordion-toggle field-label">{{field.key}}</a>' +
                '</div>' +
                '<div class="accordion-body collapse out">' +
                '<div class="accordion-inner">' +
                '<div heli-admin-field-body field="field"></div>' +
                '</div>' +
                '</div>' +
                '</div>'
      link: (scope, iElement, iAttrs) ->
        iElement.find(".field-label").bind 'click', (evt) ->
          iElement.find(".collapse").collapse('toggle')
  )

  .directive('heliAdminFields', () ->
    result = 
      restrict: "A"
      replace: true
      transclude: true
      template: '<div class="accordion" id="fields-accordion">' +
                '<div ng-repeat="field in fields" heli-admin-field field="field">' +
                '</div>'
  )

  .directive('heliAdminUsers', () ->
    result = 
      restrict: "A"
      replace: true
      transclude: true
      scope: false
      template: '<table class="table table-bordered table-striped table-condensed">' +
                '<thead>' +
                '<tr>' +
                '<th>Username</th>' +
                '<th>Roles</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>' +
                '</tbody>' + 
                '</table>'
      link: (scope, iElement, iAttrs, controller) ->
        scope.$watch 'users.data', (users) -> 
          console.log "New value", users
          if users?
            jQuery(iElement).dataTable(
              sPaginationType: "bootstrap"
              bPaginate: true
              aaData: angular.copy(users)
              aoColumns: [ { 
                "sTitle": "Username", 
                "sClass": "span8", 
                "mData": "userId",
                "mRender" : (data) ->
                  "<a href='/admin/users/#{data}'>#{data}</a>"
              }, { 
                "sTitle": "Roles", 
                "sClass": "span4", 
                "mData": "roles" 
              }]
              aaSorting: [[ 0, "asc" ]]
            )
    result
  )

