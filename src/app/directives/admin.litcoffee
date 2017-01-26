> Copyright 2014(c) The Ontario Institute for Cancer Research. All rights reserved.
>
> This program and the accompanying materials are made available under the terms of the GNU Public
> License v3.0. You should have received a copy of the GNU General Public License along with this
> program. If not, see <http://www.gnu.org/licenses/>.
>
> THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
> IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
> FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
> CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
> DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
> DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
> WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY
> WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


Administration directives
-------------------------

This module provides the directives needed to support administration tasks, such as those which
can be used to edit studies, steps, and so on.

    angular
      .module 'heliotrope.directives.admin', []


The `heli-admin-range` directive provides a text control that can be used to enter a range of
values. This is used, for example, by a dropdown control, to enter the range of options allowed.

      .directive 'heliAdminRange', () ->
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


The `heli-admin-field-body` directive provides a form fragment that defines an entire field
for a step.

      .directive 'heliAdminFieldBody', () ->
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


The `heli-admin-field` directive provides a form fragment that defines the field for a step.
This allows the body to be expanded and collapsed.

      .directive 'heliAdminField', () ->
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


The `heli-admin-field` directive provides a form fragment that defines all the field for a steps.
This is the top-level control for a step.

      .directive 'heliAdminFields', () ->
        result =
          restrict: "A"
          replace: true
          transclude: true
          template: '<div class="accordion" id="fields-accordion">' +
                    '<div ng-repeat="field in fields" heli-admin-field field="field">' +
                    '</div>'


The `heli-admin-field` directive provides a form control that allows a set of users to be
specified. This is used to allow read and write permissions to be set on a per-field basis.

      .directive 'heliAdminUsers', () ->
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
                  sPaginationType: "bs_normal"
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
