angular.module('heliotrope.services.tracker', ['ngResource'])

  # Some value, it might be useful for something. Or it might not. 

  .value('version', '0.1')

  # Service to access the study list. This is usually the top level of the
  # data access.

  .factory('StudyList', ($resource) ->
    $resource('/tracker/api/studies', {},
      query: 
        method: 'GET'
    )
  )

  # Service to access the study information. This is usually the top level of the
  # data access for a given study.

  .factory('Study', ($resource) ->
    $resource('/tracker/api/studies/:study', {},
      query: 
        method: 'GET'
    )
  )

  # Service to access the properties and relationships of an entity within a study. 

  .factory('Entity', ($resource) ->
    Entity = $resource('/tracker/api/studies/:study/:role/:identity', {},
      query: 
        method: 'GET'
    )
    Entity.prototype.getField = (x) ->
      this.data.values[x]
    Entity
  )

  # Service to access the views for an entity role. 

  .factory('Views', ($resource) ->
    $resource('/tracker/api/views/:study/:role', {},
      query: 
        method: 'GET'
    )
  )

  # Service to access the data for a particular step for a given entity. 

  .factory('EntityStep', ($resource) ->
    EntityStep = $resource('/tracker/api/studies/:study/:role/:identity/step/:step', {},
      query: 
        method: 'GET'
    )
    EntityStep.prototype.getField = (x) ->
      this.data.values[x]
    EntityStep
  )

  # Service to access a list of all entities with a given role. 

  .factory('Entities', ($resource) ->
    Entities = $resource('/tracker/api/studies/:study/:role', {},
      query: 
        method: 'GET'
    )
    Entities
  )
  
  # Service to access a list of all entities related to a given entity. This will often be
  # filtered by a passed role query argument, although other filters may also be possible. 

  .factory('RelatedEntities', ($resource) ->
    RelatedEntities = $resource('/tracker/api/studies/:study/:role/:identity/related', {},
      query: 
        method: 'GET'
    )
    RelatedEntities
  )
  
