angular
  .module('heliotrope', [
    'heliotrope.filters'
    'heliotrope.controllers.common'
    'heliotrope.controllers.tracker'
    'heliotrope.controllers.knowledge'
    'heliotrope.services.tracker'
    'heliotrope.services.knowledge'
    'heliotrope.services.genomics'
    'heliotrope.directives'
    'heliotrope.directives.authentication'
    'heliotrope.directives.charts'
    'heliotrope.directives.forms'
    'heliotrope.directives.editing'
    'heliotrope.directives.tables'
    'heliotrope.directives.workflows'
    'heliotrope.directives.navigation'
    'heliotrope.directives.admin'
  ])
  .config(['$routeProvider', ($routeProvider) ->
    $routeProvider.when "/search",                                     {templateUrl: 'app/partials/search.html',         controller: "SearchController"}
    $routeProvider.when "/",                                           {templateUrl: 'app/partials/studies.html',        controller: "StudyListController"}
    $routeProvider.when "/genes",                                      {templateUrl: 'app/partials/home.html',           controller: "HomeController"}
    $routeProvider.when "/genes/:gene",                                {templateUrl: 'app/partials/gene.html',           controller: "GeneController"}
    $routeProvider.when "/variants/:name",                             {templateUrl: 'app/partials/variant.html',        controller: "VariantController"}
    $routeProvider.when "/publications/:type/:id",                     {templateUrl: 'app/partials/publication.html',    controller: "PublicationController"}
    $routeProvider.when "/studies",                                    {templateUrl: 'app/partials/studies.html',        controller: "StudyListController"}
    $routeProvider.when "/studies/:study",                             {templateUrl: 'app/partials/study.html',          controller: "StudyController"}
    $routeProvider.when "/studies/:study/:role/:identity",             {templateUrl: 'app/partials/entity.html',         controller: "EntityController"}
    $routeProvider.when "/studies/:study/:role/:identity/step/:step",  {templateUrl: 'app/partials/step.html',           controller: "EntityStepController"}
    $routeProvider.when "/admin",                                      {templateUrl: 'app/partials/admin.html',          controller: "AdminController"}
    $routeProvider.when "/admin/studies",                              {templateUrl: 'app/partials/admin_studies.html',  controller: "AdminStudyController"}
    $routeProvider.when "/admin/studies/:study",                       {templateUrl: 'app/partials/admin_studies.html',  controller: "AdminStudyController"}
    $routeProvider.when "/admin/studies/:study/steps",                 {templateUrl: 'app/partials/admin_steps.html',    controller: "AdminStudyController"}
    $routeProvider.when "/admin/studies/:study/views",                 {templateUrl: 'app/partials/admin_views.html',    controller: "AdminViewsController"}
    $routeProvider.when "/admin/steps/:study",                         {templateUrl: 'app/partials/admin_step.html',     controller: "AdminStepController"}
    $routeProvider.when "/admin/steps/:study/:role/:step",             {templateUrl: 'app/partials/admin_step.html',     controller: "AdminStepController"}
    $routeProvider.when "/admin/views/:study",                         {templateUrl: 'app/partials/admin_view.html',     controller: "AdminViewController"}
    $routeProvider.when "/admin/views/:study/:role/:view",             {templateUrl: 'app/partials/admin_view.html',     controller: "AdminViewController"}
    $routeProvider.when "/admin/users",                                {templateUrl: 'app/partials/admin_users.html',    controller: "AdminUsersController"}
    $routeProvider.when "/admin/users/:user",                          {templateUrl: 'app/partials/admin_user.html',     controller: "AdminUsersController"}
    $routeProvider.otherwise {redirectTo: "/view1"}
  ])
  .config(['$locationProvider', ($locationProvider) ->
    $locationProvider.html5Mode(true)
    $locationProvider.hashPrefix = "!"
  ])

  .config(['$httpProvider', ($httpProvider) ->

    authenticationInterceptor = ($rootScope, $q) ->

      success = (response) ->
        $rootScope.$emit "event:stopSpinner"
        # console.log 'HTTP successful response: ', response
        response

      error = (response) ->
        $rootScope.$emit "event:stopSpinner"
        status = response.status

        if status == 401
          deferred = $q.defer()
          req = {config: response.config, deferred: deferred}
          $rootScope.requests401.push(req)
          $rootScope.$broadcast 'event:loginRequired'
          deferred.promise
        else
          $q.reject response

      (promise) ->
        $rootScope.$emit "event:startSpinner"
        promise.then(success, error)

    $httpProvider.responseInterceptors.push(authenticationInterceptor)
    
  ])

  .run(['$rootScope', '$http', '$location', '$timeout', (scope, $http, $location, $timeout) ->

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
        spinnerPromise = $timeout(
          (() ->
            if ! spinner
              target = document.getElementById('spinner-container');
              spinner = new Spinner({lines: 12})
              spinner.spin(target)
          ),
          200
        )

    scope.$on 'event:stopSpinner', () ->
      if spinnerPromise
        $timeout.cancel(spinnerPromise)
        spinnerPromise = false

      if spinner
        spinner.stop()
        spinner = false

    scope.$on 'event:loginCancelled', () ->
      $location.path('/')

    scope.$on 'event:logoutConfirmed', () ->
      scope.user = undefined
      $location.path('/')

    scope.$on 'event:loginConfirmed', (event, user) ->
      scope.user = new User(user)

      retry = (req) ->
        $http(req.config).then (response) ->
          req.deferred.resolve(response)

      retry(request) for request in scope.requests401

    scope.$on 'event:loginRequest', (event, username, password) ->
      payload = jQuery.param
        username: username
        password: password

      success = (data) ->
        scope.$broadcast 'event:loginConfirmed', data.data.user
      
      error = (data) ->

      $http.post('/authentication/api/login', payload, config).success(success).error(error)

    scope.$on 'event:logoutRequest', () ->

      $http.post('/authentication/api/logout', {}, config).success (data) ->
        scope.$broadcast 'event:logoutConfirmed'

    # When we start the app, we might be on an unauthenticated route but still have a session
    # info available. This allows us to pick up the initial service level user. It should always
    # return a 200 status (i.e., not be restricted by authentication, and return the current user)
    # exactly like the login event system.
    ping = () ->
      $http.get('/authentication/api/ping', {}, config).success (data) ->
        if data.data.user
          scope.$broadcast 'event:loginConfirmed', data.data.user

    ping()
  ])


jQuery.extend(jQuery.fn.dataTableExt.oStdClasses, {
  "sSortAsc": "header headerSortDown", 
  "sSortDesc": "header headerSortUp", 
  "sSortable": "header"
})

jQuery.extend(jQuery.fn.dataTableExt.oSort, {
  "percent-pre": (a) ->
    x = if a == "-" then 0 else a.replace( /%/, "" )
    parseFloat(x)
 
  "percent-asc": (a, b) ->
    if a < b then -1 else if (a > b) then 1 else 0
  
  "percent-desc": (a, b) ->
    if a < b then 1 else if (a > b) then -1 else 0
})

jQuery(document).ready () ->
  jQuery('body').on('.tooltip.data-api')
