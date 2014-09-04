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


Common controllers
------------------

This module provides the controllers used for navigation and authentication, and which are common
to both the tracker and the knowledge base.

    angular
      .module 'heliotrope.controllers.common', [
        'heliotrope.services.tracker'
      ]


The navigation controller uses a list of studies. This is then exposed in the main navigation bar.

      .controller 'NavigationController', Array '$scope', 'StudyList', ($scope, StudyList) ->

        $scope.studiesAvailable = false

        $scope.studies = StudyList.get(
          {}
          () -> $scope.studiesAvailable = true
          () ->
        )

The authentication controller provides logging in and logging out methods, which transmit events
to the application core, where they can be handled uniformly.

      .controller 'AuthenticationController', Array '$scope', ($scope) ->

        $scope.username = undefined
        $scope.password = undefined

        $scope.login = (username, password) ->
          # console.log "Calling AuthenticationController event:loginRequest with #{username} and #{password}"
          $scope.$emit "event:loginRequest", username, password

        $scope.cancelLogin = () ->
          $scope.$emit "event:loginCancelled"

        $scope.logout = () ->
          $scope.$emit "event:logoutRequest"

