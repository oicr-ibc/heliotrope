angular
  .module 'heliotrope.services.interceptor', []

  .factory 'httpInterceptor', Array '$rootScope', '$q', ($rootScope, $q) ->
    result =
      request: (request) ->
        $rootScope.$emit "event:startSpinner"
        request

      response: (response) ->
        $rootScope.$emit "event:stopSpinner"
        response

      responseError: (response) ->
        $rootScope.$emit "event:stopSpinner"
        status = response.status

        if status == 401
          deferred = $q.defer()
          if ! response.config.url.match(/^\/api\/authentication/)
            req = {config: response.config, deferred: deferred}
            $rootScope.requests401.push(req)
          $rootScope.$broadcast 'event:loginRequired'
          deferred.promise
        else
          $q.reject response
