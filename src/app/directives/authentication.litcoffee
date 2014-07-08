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


      .directive('heliLoginForm', () ->
        result =
          restrict: "A"
          replace: true
          template: '<div id="loginModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="loginModal" aria-hidden="true">' +
                    '  <div class="modal-header">' +
                    '    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>' +
                    '    <h3 id="loginModal">Login</h3>' +
                    '  </div>' +
                    '  <form class="form-horizontal" style="padding-top: 1em">' +
                    '  <div class="control-group">' +
                    '    <label class="control-label" for="inputUsername">Username</label>' +
                    '    <div class="controls">' +
                    '      <input type="text" id="inputUsername" placeholder="Username" ng-model="username">' +
                    '    </div>' +
                    '  </div>' +
                    '  <div class="control-group">' +
                    '    <label class="control-label" for="inputPassword">Password</label>' +
                    '    <div class="controls">' +
                    '      <input type="password" id="inputPassword" placeholder="Password" ng-model="password">' +
                    '    </div>' +
                    '  </div> ' +
                    '  </form>' +
                    '  <div class="modal-footer">' +
                    '    <button class="btn" aria-hidden="true" ng-click="cancelLogin()">Cancel</button>' +
                    '    <button class="btn btn-primary" data-dismiss="modal" ng-click="login(username, password)">Login</button>' +
                    '  </div>' +
                    '</div>'
          link: (scope, iElement, iAttrs, controller) ->
            scope.$on 'event:loginRequired', () ->
              iElement.modal()
      )