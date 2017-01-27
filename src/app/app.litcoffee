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

The main application
--------------------


Import all the dependent packages needed.

    angular
      .module 'heliotrope', [
        'ng'
        'ngRoute'
        'heliotrope.services.common'
        'heliotrope.services.tracker'
        'heliotrope.services.knowledge'
        'heliotrope.services.genomics'
        'heliotrope.services.interceptor'
        'heliotrope.services.publications'
        'heliotrope.controllers.common'
        'heliotrope.controllers.knowledge'
        'heliotrope.controllers.tracker'
        'heliotrope.directives.core'
        'heliotrope.directives.admin'
        'heliotrope.directives.authentication'
        'heliotrope.directives.charts'
        'heliotrope.directives.editing'
        'heliotrope.directives.forms'
        'heliotrope.directives.navigation'
        'heliotrope.directives.tables'
        'heliotrope.directives.workflows'
        'heliotrope.filters'
        'heliotrope-templates'
      ]


Configure the page URLs using `$routeProvider`.

      .config Array '$routeProvider', ($routeProvider) ->
        $routeProvider.when "/search",                                     {templateUrl: '/heliotrope/partials/search.html',         controller: "SearchController"}
        $routeProvider.when "/",                                      {templateUrl: '/heliotrope/partials/home.html',           controller: "HomeController"}
        $routeProvider.when "/genes",                                      {templateUrl: '/heliotrope/partials/home.html',           controller: "HomeController"}
        $routeProvider.when "/genes/:gene",                                {templateUrl: '/heliotrope/partials/gene.html',           controller: "GeneController"}
        $routeProvider.when "/variants/:name",                             {templateUrl: '/heliotrope/partials/variant.html',        controller: "VariantController"}
        $routeProvider.when "/publications/:type/:id",                     {templateUrl: '/heliotrope/partials/publication.html',    controller: "PublicationController"}
        $routeProvider.when "/studies",                                    {templateUrl: '/heliotrope/partials/studies.html',        controller: "StudyListController"}
        $routeProvider.when "/studies/:study",                             {templateUrl: '/heliotrope/partials/study.html',          controller: "StudyController"}
        $routeProvider.when "/studies/:study/:role/:identity",             {templateUrl: '/heliotrope/partials/entity.html',         controller: "EntityController"}
        $routeProvider.when "/studies/:study/:role/:identity/step/:step",  {templateUrl: '/heliotrope/partials/step.html',           controller: "EntityStepController"}
        $routeProvider.when "/admin",                                      {templateUrl: '/heliotrope/partials/admin.html',          controller: "AdminController"}
        $routeProvider.when "/admin/studies",                              {templateUrl: '/heliotrope/partials/admin_studies.html',  controller: "AdminStudyController"}
        $routeProvider.when "/admin/studies/:study",                       {templateUrl: '/heliotrope/partials/admin_studies.html',  controller: "AdminStudyController"}
        $routeProvider.when "/admin/studies/:study/steps",                 {templateUrl: '/heliotrope/partials/admin_steps.html',    controller: "AdminStudyController"}
        $routeProvider.when "/admin/studies/:study/views",                 {templateUrl: '/heliotrope/partials/admin_views.html',    controller: "AdminViewsController"}
        $routeProvider.when "/admin/steps/:study",                         {templateUrl: '/heliotrope/partials/admin_step.html',     controller: "AdminStepController"}
        $routeProvider.when "/admin/steps/:study/:role/:step",             {templateUrl: '/heliotrope/partials/admin_step.html',     controller: "AdminStepController"}
        $routeProvider.when "/admin/views/:study",                         {templateUrl: '/heliotrope/partials/admin_view.html',     controller: "AdminViewController"}
        $routeProvider.when "/admin/views/:study/:role/:view",             {templateUrl: '/heliotrope/partials/admin_view.html',     controller: "AdminViewController"}
        $routeProvider.when "/admin/users",                                {templateUrl: '/heliotrope/partials/admin_users.html',    controller: "AdminUsersController"}
        $routeProvider.when "/admin/users/:user",                          {templateUrl: '/heliotrope/partials/admin_user.html',     controller: "AdminUsersController"}
        $routeProvider.otherwise {redirectTo: "/view1"}


Set to use HTML5 mode for the URLs, i.e., no need for a visible fragment in the URLs. This should be matched
in the proxying to make sure these (not API) pages, are mapped to the same `index.html` page. This lets Angular
take care of the rest.

      .config Array '$locationProvider', ($locationProvider) ->
        $locationProvider.html5Mode(true)
        $locationProvider.hashPrefix = "!"


Adds the interceptor, used to delegate authentication to the services.

      .config Array '$httpProvider', ($httpProvider) ->
        $httpProvider.interceptors.push 'httpInterceptor'


When starting, run to add various items to `$rootScope`: combined, these work with the interceptor
to set up authentication, trapping the events we get when accessing an unauthorized item and
using them to trigger a login dialog.

      .run Array '$rootScope', '$http', '$location', '$timeout', (scope, $http, $location, $timeout) ->

        class User
          constructor: (user) ->
            for own key, value of user
              this[key] = value

          hasRole: (role) ->
            role in @roles

        # Holds all the requests which failed due to 401 response.
        scope.requests401 = []
        scope.user = undefined

        scope.login = () ->
          scope.$emit "event:loginRequest"

        scope.logout = () ->
          scope.$emit "event:logoutRequest"

        scope.$on 'event:loginRequired', () ->

        config =
          headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}

        spinner = false
        spinnerPromise = false

        # Probably should let this be handled by an authentication controller
        # which can handle a modal dialog and initiate the event:loginRequest
        # event. It actually seems I am beginning to understand AngularJS

        scope.$on 'event:startSpinner', () ->
          if ! spinnerPromise
            timeoutFn = () ->
              if ! spinner
                target = document.getElementById('spinner-container');
                spinner = new Spinner({lines: 12})
                spinner.spin(target)
            spinnerPromise = $timeout timeoutFn, 100, false

        scope.$on 'event:stopSpinner', () ->
          if spinnerPromise
            $timeout.cancel(spinnerPromise)
            spinnerPromise = false

          if spinner
            spinner.stop()
            spinner = false

        scope.$on 'event:loginCancelled', () ->
          # console.log 'Called rootScope event:loginCancelled'
          $location.path('/')

        scope.$on 'event:logoutConfirmed', () ->
          # console.log 'Called rootScope event:logoutConfirmed'
          scope.user = undefined
          $location.path('/')

        scope.$on 'event:loginConfirmed', (event, user) ->
          # console.log 'Called rootScope event:loginConfirmed'
          scope.user = new User(user)

          retry = (req) ->
            $http(req.config).then (response) ->
              req.deferred.resolve(response)

          retry(request) for request in scope.requests401

        scope.$on 'event:loginRequest', (event, username, password) ->
          # console.log "Called rootScope event:loginRequest with #{username} #{password}"

          payload = jQuery.param
            username: username
            password: password

          $http
            .post '/api/authentication/login', payload, config

            .then((res) ->  # Success callback
              scope.$broadcast 'event:loginApproved', res.data.data.user
              scope.$emit 'event:loginConfirmed', res.data.data.user
            ,(res) -> # Error callback
              scope.$broadcast 'event:loginDenied', res.data)

        scope.$on 'event:logoutRequest', () ->
          # console.log 'Called rootScope event:logoutRequest'
          $http.post('/api/authentication/logout', {}, config).then (data) ->
            scope.$broadcast 'event:logoutConfirmed'

        # When we start the app, we might be on an unauthenticated route but still have a session
        # info available. This allows us to pick up the initial service level user. It should always
        # return a 200 status (i.e., not be restricted by authentication, and return the current user)
        # exactly like the login event system.
        ping = () ->
          $http.get('/api/authentication/ping', {}, config).then (data) ->
            if data.data.user
              scope.$broadcast 'event:loginConfirmed', data.data.user

        ping()


Add the `html-percent` format to DataTables.

    jQuery.extend(jQuery.fn.dataTableExt.oStdClasses, {
      "sSortAsc": "header headerSortDown",
      "sSortDesc": "header headerSortUp",
      "sSortable": "header"
    })

    jQuery.extend(jQuery.fn.dataTableExt.oSort, {
      "html-percent-pre": (a) ->
        a = a.replace /<[^>]+>/, ''
        x = if a == "-" then 0 else a.replace( /%/, "" )
        parseFloat(x)

      "html-percent-asc": (a, b) ->
        if a < b then -1 else if (a > b) then 1 else 0

      "html-percent-desc": (a, b) ->
        if a < b then 1 else if (a > b) then -1 else 0
    })


Enable tooltips.

    jQuery(document).ready () ->
      jQuery('body').on('.tooltip.data-api')
