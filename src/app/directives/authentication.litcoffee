Authentication directives
=========================

This module provides the directives needed to support authentication. These are invoked in a scope
managed by the `AuthenticationController`.


    angular
      .module('heliotrope.directives.authentication', [])


The `heliLoginForm` directive manages the login form. It waits for a broadcast event
`event:loginRequired` and then displays a modal dialog. On successful completion, it
passes the login information back to the controller to send back for a modest cookie-based
authentication system.


      .directive 'heliLoginForm', () ->
        result =
          restrict: "A"
          replace: true
          template: '<div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="loginModal" aria-hidden="true">' +
                    '  <div class="modal-dialog">' +
                    '    <div class="modal-content">' +
                    '      <div class="modal-header">' +
                    '        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                    '        <h4 id="loginModal">Login</h4>' +
                    '      </div>' +
                    '      <div class="modal-body">' +
                    '        <form class="form-horizontal" style="padding-top: 1em">' +
                    '          <div class="control-group">' +
                    '            <label class="control-label" for="inputUsername">Username</label>' +
                    '            <div class="controls">' +
                    '              <input type="text" id="inputUsername" placeholder="Username" ng-model="username">' +
                    '            </div>' +
                    '          </div>' +
                    '          <div class="control-group">' +
                    '            <label class="control-label" for="inputPassword">Password</label>' +
                    '            <div class="controls">' +
                    '              <input type="password" id="inputPassword" placeholder="Password" ng-model="password">' +
                    '            </div>' +
                    '          </div> ' +
                    '        </form>' +
                    '      </div> ' +
                    '      <div class="modal-footer">' +
                    '        <button class="btn" aria-hidden="true" data-dismiss="modal">Cancel</button>' +
                    '        <button class="btn btn-primary" ng-click="login(username, password)">Login</button>' +
                    '      </div>' +
                    '    </div>' +
                    '  </div>' +
                    '</div>'
          link: (scope, iElement, iAttrs, controller) ->

            scope.$on 'event:loginRequired', () ->
              ## console.log 'Starting modal'
              iElement.modal('show')

            scope.$on 'event:loginApproved', () ->
              ## console.log 'Closing modal'
              iElement.modal('hide')
