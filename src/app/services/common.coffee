angular.module('heliotrope.services.common', ['ngResource'])

  # Service to access data for users.
  .factory 'Users', ['$resource', ($resource) ->
    Users = $resource('/api/authentication/users/:user', {},
      query:
        method: 'GET'
    )
    Users
  ]