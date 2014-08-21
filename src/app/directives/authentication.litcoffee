## Copyright 2014(c) The Ontario Institute for Cancer Research. All rights reserved.
##
## This program and the accompanying materials are made available under the terms of the GNU Public
## License v3.0. You should have received a copy of the GNU General Public License along with this
## program. If not, see <http://www.gnu.org/licenses/>.
##
## THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
## IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
## FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
## CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
## DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
## DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
## WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY
## WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

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
                    '          <div class="form-group">' +
                    '            <label class="control-label col-sm-3" for="inputUsername">Username</label>' +
                    '            <div class="col-sm-9">' +
                    '              <input type="text" class="form-control" id="inputUsername" placeholder="Username" ng-model="username">' +
                    '            </div>' +
                    '          </div>' +
                    '          <div class="form-group">' +
                    '            <label class="control-label col-sm-3" for="inputPassword">Password</label>' +
                    '            <div class="col-sm-9">' +
                    '              <input type="password" class="form-control" id="inputPassword" placeholder="Password" ng-model="password">' +
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
