angular.module('heliotrope.services.common', ['ngResource'])

  # Service to access data for users.
  .factory('Users', ($resource) ->
    Users = $resource('/authentication/api/users/:user', {},
      query: 
        method: 'GET'
    )
    Users
  )