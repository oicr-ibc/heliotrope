angular.module('heliotrope.services.tracker', ['ngResource'])

  # Some value, it might be useful for something. Or it might not.

  .value('version', '0.1')

  # Service to access the study list. This is usually the top level of the
  # data access.

  .factory 'StudyList', Array '$resource', ($resource) ->
    StudyList = $resource('/api/tracker/studies', {},
      query:
        method: 'GET'
    )
    StudyList

  # Service to access the study information. This is usually the top level of the
  # data access for a given study.

  .factory 'Study', ['$resource', ($resource) ->
    $resource('/api/tracker/studies/:study', {},
      query:
        method: 'GET'
    )
    Study
  ]

  # Service to access the properties and relationships of an entity within a study.

  .factory 'Entity', ['$resource', ($resource) ->
    Entity = $resource('/api/tracker/studies/:study/:role/:identity', {},
      query:
        method: 'GET'
    )
    Entity.prototype.getField = (x) ->
      this.data.values[x]
    Entity
  ]

  # Service to access the views for an entity role. Technically, the role is optional

  .factory 'Views', ['$resource', ($resource) ->
    $resource('/api/tracker/views/:study/:role', {},
      query:
        method: 'GET'
    )
  ]

  # Service to access the data for a particular step for a given entity.

  .factory 'EntityStep', ['$resource', ($resource) ->
    EntityStep = $resource('/api/tracker/studies/:study/:role/:identity/step/:step', {},
      query:
        method: 'GET'
    )
    EntityStep.prototype.getField = (x) ->
      this.data.values[x]
    EntityStep
  ]

  # Service to access a list of all entities with a given role.

  .factory 'Entities', ['$resource', ($resource) ->
    Entities = $resource('/api/tracker/studies/:study/:role', {},
      query:
        method: 'GET'
    )
    Entities
  ]

  # Service to access a list of all entities related to a given entity. This will often be
  # filtered by a passed role query argument, although other filters may also be possible.

  .factory 'RelatedEntities', ['$resource', ($resource) ->
    RelatedEntities = $resource('/api/tracker/related/:study/:role/:identity', {},
      query:
        method: 'GET'
    )
    RelatedEntities
  ]

  # Service to access the data for a particular step for a given study. We're breaking away
  # from the resource structure convention here, largely so we don't break the use of a
  # role called step. That might seem frivolous and unlikely. It probably is.

  .factory 'Step', ['$resource', ($resource) ->
    Step = $resource('/api/tracker/steps/:study/:role/:step', {},
      query:
        method: 'GET'
    )
    Step
  ]

  # Service to access the data for a particular view for a given study. We're breaking away
  # from the resource structure convention here, largely so we don't break the use of a
  # role called view. That might seem frivolous and unlikely. It probably is.

  .factory 'View', ['$resource', ($resource) ->
    View = $resource('/api/tracker/views/:study/:role/:view', {},
      query:
        method: 'GET'
    )
    View
  ]
