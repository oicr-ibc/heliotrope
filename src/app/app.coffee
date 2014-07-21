angular
  .module 'heliotrope', [
    'ng'
    'ngRoute'
    'heliotrope.services.common'
    'heliotrope.services.tracker'
    'heliotrope.services.knowledge'
    'heliotrope.services.genomics'
    'heliotrope.services.interceptor'
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

  .config ['$routeProvider', ($routeProvider) ->
    $routeProvider.when "/search",                                     {templateUrl: '/heliotrope/partials/search.html',         controller: "SearchController"}
    $routeProvider.when "/",                                           {templateUrl: '/heliotrope/partials/studies.html',        controller: "StudyListController"}
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
  ]

  .config ['$locationProvider', ($locationProvider) ->
    $locationProvider.html5Mode(true)
    $locationProvider.hashPrefix = "!"
  ]

  .config ['$httpProvider', ($httpProvider) ->
    $httpProvider.interceptors.push 'httpInterceptor'
  ]

  .run ['$rootScope', '$http', '$location', '$timeout', (scope, $http, $location, $timeout) ->

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
      ## console.log 'Called event:loginCancelled'
      $location.path('/')

    scope.$on 'event:logoutConfirmed', () ->
      ## console.log 'Called event:logoutConfirmed'
      scope.user = undefined
      $location.path('/')

    scope.$on 'event:loginConfirmed', (event, user) ->
      ## console.log 'Called event:loginConfirmed'
      scope.user = new User(user)

      retry = (req) ->
        console.log "Retrying queued 401 request: #{req}"
        $http(req.config).then (response) ->
          req.deferred.resolve(response)

      retry(request) for request in scope.requests401

    scope.$on 'event:loginRequest', (event, username, password) ->
      ## console.log "Called event:loginRequest with #{username} #{password}"
      payload = jQuery.param
        username: username
        password: password

      success = (data) ->
        ## console.log "Calling event:loginApproved with #{data}"
        scope.$broadcast 'event:loginApproved', data.data.user
        scope.$emit 'event:loginConfirmed', data.data.user

      error = (data) ->
        ## console.log "Calling event:loginDenied with #{data}"
        scope.$broadcast 'event:loginDenied', data.data.user

      $http
        .post '/api/authentication/login', payload, config
        .success success
        .error error

    scope.$on 'event:logoutRequest', () ->
      ## console.log 'Called event:logoutRequest'
      $http.post('/api/authentication/logout', {}, config).success (data) ->
        scope.$broadcast 'event:logoutConfirmed'

    # When we start the app, we might be on an unauthenticated route but still have a session
    # info available. This allows us to pick up the initial service level user. It should always
    # return a 200 status (i.e., not be restricted by authentication, and return the current user)
    # exactly like the login event system.
    ping = () ->
      $http.get('/api/authentication/ping', {}, config).success (data) ->
        if data.data.user
          scope.$broadcast 'event:loginConfirmed', data.data.user

    ping()
  ]


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

jQuery(document).ready () ->
  jQuery('body').on('.tooltip.data-api')
