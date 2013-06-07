angular
  .module('heliotrope', [
    'heliotrope.filters'
    'heliotrope.controllers.common'
    'heliotrope.controllers.tracker'
    'heliotrope.controllers.knowledge'
    'heliotrope.services.tracker'
    'heliotrope.services.knowledge'
    'heliotrope.directives'
    'heliotrope.directives.authentication'
    'heliotrope.directives.charts'
    'heliotrope.directives.forms'
    'heliotrope.directives.editing'
    'heliotrope.directives.tables'
    'heliotrope.directives.workflows'
    'heliotrope.directives.navigation'
  ])
  .config(['$routeProvider', ($routeProvider) ->
    $routeProvider.when "/search",                                     {templateUrl: 'app/partials/search.html',       controller: "SearchController"}
    $routeProvider.when "/",                                           {templateUrl: 'app/partials/home.html',         controller: "HomeController"}
    $routeProvider.when "/genes",                                      {templateUrl: 'app/partials/home.html',         controller: "HomeController"}
    $routeProvider.when "/genes/:gene",                                {templateUrl: 'app/partials/gene.html',         controller: "GeneController"}
    $routeProvider.when "/variants/:name",                             {templateUrl: 'app/partials/variant.html',      controller: "VariantController"}
    $routeProvider.when "/studies",                                    {templateUrl: 'app/partials/studies.html',      controller: "StudyListController"}
    $routeProvider.when "/studies/:study",                             {templateUrl: 'app/partials/study.html',        controller: "StudyController"}
    $routeProvider.when "/studies/:study/:role/:identity",             {templateUrl: 'app/partials/entity.html',       controller: "EntityController"}
    $routeProvider.when "/studies/:study/:role/:identity/step/:step",  {templateUrl: 'app/partials/step.html',         controller: "EntityStepController"}
    $routeProvider.otherwise {redirectTo: "/view1"}
  ])
  .config(['$locationProvider', ($locationProvider) ->
    $locationProvider.html5Mode(true)
    $locationProvider.hashPrefix = "!"
  ])

  .config(['$httpProvider', ($httpProvider) ->

    authenticationInterceptor = ($rootScope, $q) ->

      success = (response) ->
        # console.log 'HTTP successful response: ', response
        response

      error = (response) ->
        status = response.status
        console.log 'HTTP response status: ',status, response

        if status == 401
          deferred = $q.defer()
          req = {config: response.config, deferred: deferred}
          $rootScope.requests401.push(req)
          $rootScope.$broadcast 'event:loginRequired'
          deferred.promise
        else
          $q.reject response

      (promise) ->
        promise.then(success, error)

    $httpProvider.responseInterceptors.push(authenticationInterceptor)
    
  ])

  .run(['$rootScope', '$http', '$location', (scope, $http, $location) ->

    # Holds all the requests which failed due to 401 response.
    scope.requests401 = []

    scope.logout = () ->
      console.log "Sending logout request"
      scope.$emit "event:logoutRequest"

    scope.$on 'event:loginRequired', () ->
      console.log "Handle event:loginRequired"

    # Probably should let this be handled by an authentication controller
    # which can handle a modal dialog and initiate the event:loginRequest
    # event. It actually seems I am beginning to understand AngularJS 

    scope.$on 'event:loginCancelled', () ->
      console.log "Handle event:loginCancelled"
      $location.path('/')

    scope.$on 'event:loginConfirmed', () ->

      console.log "Handle event:loginConfirmed"

      retry = (req) ->
        console.log "About to retry request", req
        $http(req.config).then (response) ->
          req.deferred.resolve(response)

      retry(request) for request in scope.requests401

    scope.$on 'event:loginRequest', (event, username, password) ->

      config = 
        headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}

      payload = jQuery.param
        username: username
        password: password

      success = (data) ->
        console.log "Login response successful", data
        scope.$broadcast 'event:loginConfirmed'
      
      error = (data) ->
        console.log "Login response failure", data

      $http.post('/authentication/api/login', payload, config).success(success).error(error)

    scope.$on 'event:logoutRequest', () ->
      console.log "Handle event:logoutRequest"
      config = 
        headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}

      $http.post('/authentication/api/logout', {}, config).success (data) ->
        $location.path('/')
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
