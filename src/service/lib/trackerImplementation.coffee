log4js = require('log4js')
logger = log4js.getLogger('trackerImplementation')

sys =             require("sys")
mongo =           require("mongodb")
MongoClient =     mongo.MongoClient
BSON =            mongo.BSONPure

module.exports.initialize = () ->
  MongoClient.connect "mongodb://localhost:27017/tracker", (err, db) ->
    indexes = []
    addIndexes = () ->
      if indexes.length > 0
        index = indexes.shift()
        db.createIndex index["collection"], index["index"], addIndexes
    addIndexes()

## Used to manage localization from localizable server data blocks. Currently
## a stub as I18N is not a high priority task. This will eventually peek in the
## request headers, probably not using an off-the-shelf module like locale as
## there is no finite set of locales expected.

localize = (localizableData) ->
  if localizableData then localizableData["default"] else "<<missing label>>";

## Database endpoint to read all the study information. For each study, we also ought to
## provide some kind of a data block that can be useful for rendering. That will typically
## involve aggregating entity information for that study.
##
## @param err - error flag
## @param db - database connection
## @param req - web request
## @param res - web response
## @param callback - function accepting (db, err, result, res, [status])

module.exports.getStudies = (req, res) ->
  db = res.locals.db
  config = res.app.locals.config
  db.collection "studies", (err, studies) ->
    return res.status(err.code).send(err.err) if err?
    studies.find({}).toArray (err, docs) ->
      return res.status(err.code).send(err.err) if err?
      results = {}
      for doc in docs

        config = res.app.locals.config
        doc.url = config['baseUrl'] + config['trackerUriBase'] + "/studies/" + doc.name
        doc.statistics = {}
        doc.lastModified = ""
        results[doc._id.toString()] = doc

      # Now let's do a call on the entities, using aggregation to derive a more complete
      # data count for each one.

      statistics = [
        {"$project" : {"studyId" : 1, "role" : 1, "lastModified" : 1}},
        {"$group": {"_id": {"studyId": "$studyId", "role": "$role"}, "count": {"$sum" : 1}, "lastModified": {"$max" : "$lastModified"}}}
      ]

      db.collection "entities", (err, entities) ->
        return res.status(err.code).send(err.err) if err?
        entities.aggregate statistics, (err, stats) ->
          return res.status(err.code).send(err.err) if err?
          for stat in stats
            studyId = stat["_id"]["studyId"].toString()
            role = stat["_id"]["role"]
            delete stat["_id"]
            results[studyId]["statistics"][role] = stat
            results[studyId]["lastModified"] = stat["lastModified"] if !results[studyId]["lastModified"]
            results[studyId]["lastModified"] = stat["lastModified"] if stat["lastModified"] > results[studyId]["lastModified"]

          result = new Object
          result["data"] = (results[key] for own key of results)
          return res.send(result)

## Endpoint to create a new study, or update an existing study (depending on whether
## or not we have an identifier). The body is in approximately the right shape, so
## we don't need to do too much except strip out some of the crap added by the getStudy
## endpoint.
module.exports.postStudies = (err, db, req, res, callback) ->

  body = req.body
  switch

    # Validation logic
    when ! req.user.hasRole('TRACKER_ADMIN')
      callback(db, {error: "Forbidden"}, {}, res, 403)

    when ! body["data"]["name"]
      callback(db, {error: "Missing study name"}, {}, res, 400)

    # And do the action
    else
      id = body["data"]["_id"] || new BSON.ObjectID().toString()

      for field in ["config", "counts", "steps", "url", "serviceUrl", "_id", "version"]
        delete body["data"][field]

      selector = {"_id" : new BSON.ObjectID(id)}
      updates = {"$set" : {}}

      for own fieldName of body["data"]
        updates["$set"][fieldName] = body["data"][fieldName]

      updates["$inc"] = {"version" : 1}

      config = res.app.locals.config
      newUrl = config['baseUrl'] + config['trackerUriBase'] + "/studies/" + encodeURIComponent(body["data"]["name"])

      db.collection "studies", (err, studies) ->
        studies.update selector, updates, {"upsert" : true, "w" : 1, "fsync" : 1}, (err, result) ->
          callback db, err, newUrl, res


placeholderDefault = (name, defaultValue) ->
  (req) -> req.query[name] || defaultValue

placeholderObjectId = (name) ->
  (req) -> new BSON.ObjectID(req.query[name].toString())

completePlaceholders = (req, pipeline) ->
  switch typeof pipeline
    when "object"
      if Array.isArray(pipeline)
        (completePlaceholders(req, e) for e in pipeline)
      else
        result = new Object
        for own key of pipeline
          result[key] = completePlaceholders(req, pipeline[key])
        result
    when "function"
      pipeline(req)
    else
      pipeline

queries = {
  "getEntities" : {
    "collection" : "entities",
    "pipeline" : [
      { "$match" : { "studyId" : placeholderObjectId("studyId"), "role" : placeholderDefault("role", "participants") } },
      { "$sort" : { "lastModified" : -1 } },
      { "$skip" : placeholderDefault("offset", 0) },
      { "$limit" : 10 }
    ],
    "updater" : (study, results) ->
      for element in results
        element.url = study.url + "/" + element.role + "/" + element.identity
  }
}

## Database endpoint to read a single study. This should also read a set of the
## related entities of all types.
## @param name - the name of the study
## @param callback - function accepting (err, doc, db)
module.exports.getStudy = (req, res) ->
  db = res.locals.db
  findStudy req, res, 'read', (err, doc) ->

    return res.status(err.code).send(err.error) if err?

    studyId = new BSON.ObjectID doc._id.toString()
    studySelector = {"studyId": studyId}
    fields = {"_id": 1, "role": 1, "identity" : 1, "lastModified" : 1, "steps.fields.$": 1}

    # We will also want a bunch of useful queries to be run to complete
    # the study. We can use the recursive callback model to do that, so we
    # handle the JS asynchronicity as well as we can do. These could in
    # theory be done as subrequests, but to do things like counting
    # the number of participants and generating a summary of recent
    # activity is moot whether we ought to do that.

    if req["query"]?.q?

      query = req["query"]
      queryName = query["q"]
      queryRecord = queries[queryName]

      if queryRecord == undefined
        res.status(404).send("Can't find query: " + name)
      else
        collectionName = queryRecord["collection"] || "entities"
        pipeline = queryRecord["pipeline"]

        query["studyId"] = studyId
        modified = completePlaceholders(req, pipeline)

        db.collection collectionName, (err, collection) ->
          return res.status(500).send(err) if err?
          collection.aggregate modified, (err, results) ->
            return res.status(500).send(err) if err?
            queryRecord["updater"](doc, results) if queryRecord["updater"] != undefined
            result = {}
            result['data'] = results
            result['config'] = res.locals.config
            res.send result

    else
      countsQuery = getCountsQuery(studySelector)
      stepsQuery = getStepsQuery(studySelector)

      annotateEntity db, doc, [countsQuery, stepsQuery], (o) ->
        result = {}
        result['data'] = o
        result['config'] = res.locals.config
        res.send result

## Helper function to asynchronously find a study.
##
## @param db - the MongoDB connection
## @param req - the request
## @param res - the response
## @param callback - a callback, taking an error status and the resulting study

findStudy = (req, res, mode, callback) ->
  name = req.params.study
  db = res.locals.db
  db.collection "studies", (err, studies) ->
    return callback({status: 500, error: err}, null) if err?

    selector = if (name.substr(0, 3) == "id;") then {"_id": new BSON.ObjectID(name.substring(3))} else {name: name}
    studies.findOne selector, (err, study) ->

      return callback({status: 500, error: err}, null) if err?
      return callback({status: 404, error: "Not Found"}, null) if !study?

      # If we get a study back, but the requested user is not allowed access to it, then we
      # can simply refuse access. The callback needs to be subtle enough to distingish between
      # a status of 404 (not found) and 403 (forbidden). We do this by setting a local value for
      # a status when it's forbidden. Note that an authorization error is not a 401 -- that's
      # only for HTTP authorization and we are beyond that. For more information on that issue:
      # http://stackoverflow.com/questions/3297048/403-forbidden-vs-401-unauthorized-http-responses
      #
      # As an exception, obviously, administrative users (e.g., me) can always get access. And that's
      # a user role.

      config = res.locals.config
      study.url = config['baseUrl'] + config['trackerUriBase'] + "/studies/" + encodeURIComponent(study.name)

      if checkAdminAccess(req, mode) || checkAccessList(req, accessList(study), mode)
        callback null, study
      else
        callback {status: 403, error: "Forbidden"}, null


## Helper function to asynchronously find an entity.
## @param db
## @param req
## @param callback

findEntity = (req, res, studyId, role, identity, callback) ->
  db = res.locals.db
  db.collection "entities", (err, entities) ->

    selector = {"studyId": studyId, "role" : role}
    if identity.substr(0, 3) == "id;"
      key = identity.substr(3)
      if key == "new"
        return callback "no such object: " + identity, null
      else
        selector["_id"] = new BSON.ObjectID(key)
    else
      selector["identity"] = identity

    entities.findOne selector, (err, doc) ->
      if err
        callback err, null
      else
        callback null, doc

## Checks the current request against admin permissions, usually attached to
## a study or something similar.
##
## @param req - the request, containing the user
## @param mode - a string, "modify" for read/write access, and "read" for read access

checkAdminAccess = (req, mode) ->
  switch
    when ! req.user then false
    when req.user.roles && req.user.roles.indexOf('TRACKER_ADMIN') != -1 then true
    else false

module.exports.checkAdminAccess = checkAdminAccess;

## Checks a user identifier request against an access structure, usually attached to
## a study or something similar.
##
## @param req - the request, containing the user
## @param access - object with read and modify properties, possibly
## @param mode - a string, "modify" for read/write access, and "read" for read access

checkAccessList = (req, access, mode) ->

  user = req.user
  if ! user
    false
  else
    userId = user.userId
    for accessRecord in access
      if accessRecord.modify && userId in accessRecord.modify
        return true
      if accessRecord.read && userId in accessRecord.read
        return if mode != 'modify' then true else false
      if accessRecord.none && userId in accessRecord.none
        return false

    false

module.exports.checkAccessList = checkAccessList

getCountsQuery = (studySelector) ->
  {
    collection : "entities",
    aggregation: [
      {"$match" : studySelector},
      {"$project" : { "role" : 1}},
      {"$group" : {"_id" : "$role", "count" : {"$sum" : 1}}}
    ],
    callback : (object, results, next) ->
      counts = {}
      for e in results
        counts[e["_id"]] = e["count"]
      object["counts"] = counts
      next()
  }

getStepsQuery = (studySelector) ->
  {
    collection : "steps",
    aggregation: [
      {"$match" : studySelector},
      {"$sort" : { "weight" : 1}}
    ],
    callback : (object, results, next) ->
      stepData = {}
      for e in results
        stepData[e["appliesTo"]] = [] if ! stepData[e["appliesTo"]]?
        e["label"] = localize(e["label"])
        e["description"] = localize(e["description"]) if e["description"]
        stepData[e["appliesTo"]].push(e)
      object["steps"] = stepData
      next()
  }

## An asynchronous callbacky system for handling annotations on
## things. We don't actually worry too much about what we are annotating
## and we ought to be able to handle a whole bunch of different functions
## this way.
##
## @param entity
## @param queries - a list of objects, each containing {collection, query, fields, callback}
## @param callback - called when we are out of queries
annotateEntity = (db, object, queries, callback) ->
  if queries.length == 0
    callback object
  else
    queryRecord = queries.shift()
    collection = queryRecord.collection
    handler = queryRecord.callback

    db.collection collection, (err, collection) ->
      switch
        when queryRecord.query?
          fields = queryRecord.fields || {}
          cursorFunction = queryRecord.cursor || (cursor, cx) -> cursor.toArray(cx)
          cursorFunction collection.find(queryRecord.query, fields), (err, results) ->
            handler object, results, () ->
              annotateEntity(db, object, queries, callback)
        when queryRecord.aggregation?
          collection.aggregate queryRecord.aggregation, (err, results) ->
            handler object, results, () ->
              annotateEntity(db, object, queries, callback)
        else
          callback({error: "can't process query record"})

## Database endpoint to read a single study. This should also read a set of the
## related entities of all types.
## @param name - the name of the study
## @param callback - function accepting (err, doc, db)

compareViews = (a, b) ->
  aWeight = if a.weight == undefined then 1000000 else a.weight
  bWeight = if b.weight == undefined then 1000000 else b.weight
  if aWeight < bWeight then -1 else if aWeight > bWeight then 1 else 0

module.exports.getViews = (req, res) ->
  db = res.locals.db
  name = req.params.study
  role = req.params.role

  findStudy req, res, 'read', (err, doc) ->
    return res.status(500).send(err) if err?
    return res.status(404).send("Not Found") if ! doc?

    selector = {"studyId": new BSON.ObjectID(doc._id.toString())}
    selector["role"] = role if role

    db.collection "views", (err, views) ->
      views.find(selector).toArray (err, results) ->
        return res.status(500).send(err) if err?
        results.sort(compareViews)

        responseData = {}
        responseData['config'] = res.locals.config

        # If we're not using a role, structure the response accordingly.
        if role
          responseData['data'] = {study: doc, views: results};
          res.send responseData
        else
          result = {}
          for view in results
            result[view["role"]] = [] if ! result[view["role"]]?
            result[view["role"]].push(view)

          responseData['data'] = {study: doc, views: result}
          res.send responseData

## Database endpoint to read a single entity.
## @param studyName
## @param role
## @param identity
## @param callback
module.exports.getEntity = (req, res, callback) ->
  db = res.locals.db
  role = req.params.role
  identity = req.params.identity
  userId = req.user.userId

  findStudy req, res, 'read', (err, study) ->

    return res.status(500).send(err) if err?
    return res.status(404).send("Not Found") if ! study?

    studyId = new BSON.ObjectID(study._id.toString())

    findEntity req, res, studyId, role, identity, (err, entity) ->

      if err
        return callback db, {err: err}, null, res
      else if entity == undefined
        return callback db, {err: "Missing entity: " + role + ", " + identity}, null, res

      entity.study = study
      entity.notes = (study.nodes && study.notes[role]) || {}

      entity.url = study.url + "/" + encodeURIComponent(role) + "/" + encodeURIComponent(identity)

      # Find all the available steps
      stepSelector = {"studyId" : studyId, "appliesTo" : role}

      # Now locate the requested entity
      db.collection "steps", (err, steps) ->
        steps.find(stepSelector).toArray (err, allStepsArray) ->

          stepsArray = allStepsArray.sort(compareViews)
          stepsArray = (step for step in stepsArray when checkAdminAccess(req, 'read') || checkAccessList(req, accessList(step, study), 'read'))

          # And finally, related entities.
          relatedSelector = buildRelatedEntitySelector(entity)
          db.collection "entities", (err, entities) ->
            entities.find(relatedSelector).toArray (err, related) ->
              result = {}
              result['data'] = entity
              result['config'] = res.locals.config

              try
                buildRelatedEntities(entity, related)

                # Add in the step-based field definitions
                buildEntityValues(entity, related, stepsArray)
                buildEntityStepUrls(entity, stepsArray)

              catch exception
                if exception instanceof Error
                  logger.error "Error", exception.stack
                  err = {err: exception.message}
                  result = null

              finally
                if err?
                  res.status(500).send(err)
                else
                  res.send(result)
                # plugin = entity.notes.readEntity
                # return maybeInterceptedCallback(plugin, db, err, result, req, res, callback)


maybeInterceptedCallback = (plugin, db, err, result, req, res, callback) ->
  if plugin
    module = plugin["module"]
    method = plugin["method"]
    loadedModule = require("./plugins/" + module)
    method = loadedModule[method]
    method db, err, result, req, res, callback
  else
    callback db, err, result, res, 200


module.exports.getEntityStep = (req, res) ->

  studyName = req.params.study
  role = req.params.role
  identity = req.params.identity

  findStudy req, res, 'read', (err, study) ->
    return res.status(500).send(err) if err?
    return res.status(404).send("Not Found") if !study?

    studyId = new BSON.ObjectID(study._id.toString())
    entityModifier = (entity) ->
      entity.study = study
      entity.url = study.url + "/" + role + "/" + identity
      entity

    if identity == "id;new"
      entity = {}
      findEntityStepWithEntity req, res, studyId, entityModifier(entity)
    else
      findEntity req, res, studyId, role, identity, (err, entity) ->
        findEntityStepWithEntity req, res, studyId, entityModifier(entity)

## There are two sets of related entities: those which have a "steps.fields.ref"
## that link back to me, and those which we have a link to from one of ours
## steps with a reference field. We should actually ask for both. We can do
## this with a top-level $or in MongoDB, as this actually runs the queries
## in parallel.

buildRelatedEntitySelector = (entity, step, query) ->
  if ! entity._id
    alternates = []
    for own fieldKey of step.fields
      field = step.fields[fieldKey]
      alternates.push({"identity" : query[fieldKey], "role" : field.entity}) if field.type == "Reference" && query[fieldKey]
    return if alternates.length then { "$or" : alternates } else { "_id" : null }

  relatedList = []
  relatedSelector = { "steps.fields.ref" : new BSON.ObjectID(entity._id.toString()) }
  for step in entity.steps
    for field in step.fields
      ref = field['ref']
      relatedList.push(ref) if ref != undefined
  if relatedList.length == 0
    relatedSelector
  else
    { "$or" : [ { "_id" : { "$in" : relatedList } }, relatedSelector ] }

## Updates the field display values. fields is an object keyed
## by field name, and related is an array of related objects. We
## expect the core settings for a value to be available.

buildFieldsDisplayValues = (fields, related) ->
  for own field, record of fields
    type = record.type

    if record.hasOwnProperty("ref") && record.ref != null
      for rel in related
        if rel._id.equals(record.ref)
          record.displayValue = (rel.name || rel.identity)

    else if record.hasOwnProperty("value") && record.value != null
      record.displayValue = record.value.toString()

    else if record.hasOwnProperty("identity")
      record.displayValue = record.identity

buildRelatedEntities = (entity, related) ->
  data = {}
  studyUrl = entity.study.url
  for e in related
    if e.identity != undefined
      e.url = studyUrl + "/" + e.role + "/" + e.identity
    else
      e.url = studyUrl + "/" + e.role + "/" + "id;" + e._id.toString()
    data[e.role] = [] if data[e.role] == undefined
    data[e.role].push(e)

  entity.related = data;

## buildEntityValues
## @param entity
## @param stepsArray
buildEntityValues = (entity, related, stepsArray) ->
  fields = {}

  for step in stepsArray
    for own fieldName, fieldValue of step.fields
      fields[fieldName] = fieldValue

  # Now merge the keys from the entity itself.
  for step in entity.steps
    for field in step.fields
      fieldName = field.key
      fields[fieldName] = {} if ! fields[fieldName]?

      for own property of field
        fields[fieldName][property] = field[property]

  buildFieldsDisplayValues(fields, related)

  entity.values = fields

  makeStepDefinition = (step) ->
    stepDefinition = {}
    stepDefinition._id = step._id
    stepDefinition.label = if step.redoLabel then localize(step.redoLabel) else localize(step.label)
    stepDefinition.description = localize(stepDefinition.description) if step.description?
    stepDefinition.name = step.name

    if step.url
      stepDefinition.url = step.url.replace /\{\{([^}]+)\}\}/g, (match, m1) ->
        miniEval(entity, m1)
    else
      stepDefinition.url = entity.url + "/step/" + step.name

    stepDefinition

  entity.availableSteps = (makeStepDefinition(step) for step in stepsArray)

## A teeny tiny eval we can use to get properties fast without caching
## or compiling anything. Good for template usage.
## @param object
## @param value
## @returns
miniEval = (object, value) ->
  start = 0
  end = value.length
  originalValue = value
  originalObject = object
  while start != end
    next = value.indexOf(".", start)
    element = value.slice(start, (if (next == -1) then end else next))
    if object.hasOwnProperty(element)
      object = object[element]
      if next == -1
        return object
      else
        start = next + 1
    else
      console.error "Missing property", originalValue, originalObject
      throw new EvalError("Missing property: " + originalValue)

## buildEntityStepUrls adds URLs to all the steps in an entity.
## It really helps if we have a set of steps we can use with definitions
## to make sure we get the right URL.
## @param entity

buildEntityStepUrls = (entity, stepsArray) ->
  stepTable = {}

  for step in stepsArray
    stepTable[step._id.toString()] = step

  # At this late stage, we can filter out steps we don't want
  entity.steps.filter (step) ->
    stepDefinition = stepTable[step.stepRef.toString()]
    url = entity.url
    if stepDefinition
      step.url = url + "/step/" + stepDefinition.name
      step.url = step.url + ";" + step.id.toString() if stepDefinition.isRepeatable
      true
    else
      false

## Woefully inadequate. This requires us to locate related entities, as usual, and we also ought to do all
## the field defaulting code just as we do for the entity as a whole.

findEntityStepWithEntity = (req, res, studyId, entity) ->
  role = req.params.role
  stepName = req.params.step
  query = req.query || {}
  db = res.locals.db

  ## If the step name contains a semicolon, the part after the semicolon will be
  ## an ObjectId string we can use as a better way of locating repeated steps.

  stepSelector = getStepSelector(studyId, role, stepName)

  ## Now locate the requested step.
  db.collection "steps", (err, steps) ->
    steps.findOne stepSelector, (err, stepDefinition) ->
      return res.status(500).send(err) if err?
      return res.status(404).send("Missing step: " + stepName) if ! stepDefinition?

      ## This is weird logic, and I wish I'd commented it when I wrote it. The
      ## steps contain all fields. This builds a set of all field values in
      ## stepValues, but doesn't do defaulting or anything.

      stepValues = {}
      stepDataBlocks = entity.steps || []
      stepDataBlockCount = stepDataBlocks.length

      for thisStep in stepDataBlocks
        if thisStep.stepRef.equals(stepDefinition._id)
          for field in thisStep.fields
            stepValues[field.key] =
              if      field.ref != undefined   then field.ref
              else if field.value != undefined then field.value
              else                                  field.identity
          break

      selectedStepDataBlock = getSelectedDataBlock(stepName, stepDefinition, stepDataBlocks)

      ## Change the step label to be localized.
      stepDefinition.label = localize(if selectedStepDataBlock && stepDefinition.redoLabel != undefined then stepDefinition.redoLabel else stepDefinition.label)
      stepDefinition.description = localize(stepDefinition.description) if stepDefinition.description

      ## We may, or may not, have related entities here. If we do, we need to make an effort to
      ## find them, and to resolve references to display values for rendering relations to
      ## other entities. Note that some related entities may be defined even if we don't actually
      ## have a primary entity yet, because we are about to create one. Therefore, the step
      ## descriptor and the query are also required.

      ## And finally, related entities.
      relatedSelector = buildRelatedEntitySelector(entity, stepDefinition, query)

      db.collection "entities", (err, entities) ->
        return res.status(500).send(err) if err?

        entities.find(relatedSelector).toArray (err, related) ->
          return res.status(500).send(err) if err?

          buildRelatedEntities(entity, related)

          ## Now we handle the fields for the selected step.

          fields = stepDefinition.fields || {}

          ## Iff we've done this step before, find the field and merge the keys
          if selectedStepDataBlock

            for own fieldKey of fields
              stepDefinition.fields[fieldKey].label = localize(stepDefinition.fields[fieldKey].label)

              currentValueObject = undefined
              for selectedField in selectedStepDataBlock.fields
                if selectedField.key == fieldKey
                  currentValueObject = selectedField
                  break

              if typeof currentValueObject == "object"
                for own valueKey of currentValueObject
                  if valueKey != "key"
                    stepDefinition.fields[fieldKey][valueKey] = currentValueObject[valueKey]

          else

            ## We've never done this step before, but we do have a step definition. Use it
            ## to pull in query params and write values in. Especially related references,
            ## which is key.

            for own fieldKey of fields
              stepDefinition.fields[fieldKey].label = localize(stepDefinition.fields[fieldKey].label);

              field = fields[fieldKey]
              queryValue = query[fieldKey]
              if queryValue
                if field.isIdentity
                  stepDefinition.fields[fieldKey]["identity"] = queryValue
                else if field["type"] == "Reference"
                  for relatedEntity in related
                    if relatedEntity.identity == queryValue
                      stepDefinition.fields[fieldKey]["ref"] = relatedEntity._id
                      stepDefinition.fields[fieldKey]["value"] = relatedEntity.identity
                else
                  stepDefinition.fields[fieldKey]["value"] = queryValue

          buildFieldsDisplayValues stepDefinition.fields, related

          entity.step = stepDefinition

          responseData = {}
          responseData['data'] = entity
          responseData['config'] = res.locals.config
          res.send responseData

getStepSelector = (studyId, role, stepName) ->
  stepSelector = {"studyId" : studyId, "appliesTo" : role}
  semicolonPosition = stepName.indexOf(";")
  stepSelector["name"] = if semicolonPosition != -1 then stepName.substring(0, semicolonPosition) else stepName
  stepSelector

## getSelectedDataBlock returns a matching data block from a list, using
## the step identity in the step name (if there is one), or otherwise the
## identity from the step definition read from the DB.

getSelectedDataBlock = (stepName, stepDefinition, stepDataBlocks) ->

  ## If there is a step identifier in the name, the selected data block should be
  ## identified by the identifier, rather than by the name (or, strictly, stepRef)
  ## which is not unique for repeated steps.

  semicolonPosition = stepName.indexOf(";")
  stepId = if semicolonPosition != -1 then stepName.substring(semicolonPosition + 1)

  selectedStepDataBlock = undefined

  ## Special case. If the step normally repeats and we don't have an identifier
  ## then don't match any data block.
  if ! stepId && stepDefinition.isRepeatable
    return selectedStepDataBlock

  for thisStep in stepDataBlocks
    if stepId
      if thisStep.id.toString() == stepId
        selectedStepDataBlock = thisStep
        break
    else if thisStep.stepRef.equals(stepDefinition._id)
      selectedStepDataBlock = thisStep
      break

  selectedStepDataBlock

## Now we can handle some of the additional logic in handling a POST
## request. We have to handle entities as we do with a GET request. The
## special cases involve the handling of the stepOptions field. That tells
## us what to do. If the method is set to CreateEntity, we should make a new
## entity, i.e. do an upsert. Some values in some fields can be set (actually
## this needs to happen for a GET request, too, at least for display reasons)
## and then we can build a new entity and create the wee beauty.

module.exports.postEntityStep = (req, res) ->
  studyName = req.params.study
  role = req.params.role
  identity = req.params.identity
  stepName = req.params.step

  findStudy req, res, 'read', (err, study) ->

    # If we have an error, respond appropriately.
    return res.status(500).send(err) if err?
    return res.status(404).send("Not Found") if ! study?

    studyId = new BSON.ObjectID(study._id.toString())
    stepSelector = getStepSelector studyId, role, stepName

    db = res.locals.db

    # Find the referenced step
    db.collection "steps", (err, steps) ->
      return res.status(500).send(err) if err?

      steps.findOne stepSelector, (err, step) ->
        return res.status(500).send(err) if err?

        # Actually, to work with a step, we need read access to the study, and modify access
        # to the step. This means rejection. Although we have defined read access, here we don't
        # need to test for it, nor do we in reading steps either.

        access = accessList(step, study)
        if ! (checkAdminAccess(req, 'modify') || checkAccessList(req, access, 'modify'))
          return res.status(403).send("Forbidden")

        # Handle repeating steps. When we have a repeating step with an identifier as part
        # of the step name, locate that step specifically. We can use that instead of the
        # stepRef, as it is more specific. In both cases, these locate (through $) the individual
        # specific step to update.
        #
        # A special case should be the stepRef without an identifier for a repeating step.
        # In this case, we should really use a newly constructed step identifier, so we
        # guarantee not to find and modify an existing step.

        stepId = undefined
        semicolonPosition = stepName.indexOf(";")
        if semicolonPosition != -1
          stepId = stepName.substring(semicolonPosition + 1);
          stepName = stepName.substring(0, semicolonPosition);

        existingEntityStepSelector = {
          "studyId" : studyId,
          "role" : role,
          "identity" : identity
        }

        if step["isRepeatable"]
          existingEntityStepSelector["steps.id"] = if stepId then new BSON.ObjectID(stepId) else new BSON.ObjectID()
        else
          existingEntityStepSelector["steps.stepRef"] = new BSON.ObjectID(step._id.toString())

        # The important bit: build the step updater. This can generate an error. If it
        # does we should go no further but pass it to the callback here and now.

        initialUpdater = {"$set" : {}}
        initialUpdater["$set"]["steps.$.fields"] = []
        initialUpdater["$set"]["steps.$.stepDate"] = new Date()
        initialUpdater["$set"]["steps.$.stepUser"] = (req.user && req.user.userId) || null
        initialUpdater["$set"]["lastModified"] = new Date()

        findStepUpdater req, res, studyId, step, req.body.data.step.fields, {}, initialUpdater, (err, updater) ->
          return res.status(400).send(err.toString()) if err?

          # OK. At this stage we have an updater. We can proceed to use it. Again, for a repeating step,
          # we get an identifier tagged on the end of the URL.

          newIdentity = updater["$set"]["identity"] || identity
          newUrl = study.url + "/" + role + "/" + newIdentity + "/step/" + stepName
          if step["isRepeatable"]
            newUrl = newUrl + ";" + existingEntityStepSelector["steps.id"].toString()

          updateOptions = {"fsync" : true, "w" : 1}

          db.collection "entities", (err, entities) ->
            entities.update existingEntityStepSelector, updater, updateOptions, (err, result) ->

              return res.status(400).send(err) if err?

              # Now if result == 1 we changed something. If result == 0, we didn't, and
              # need to actually do something about it. That could mean that the step didn't exist,
              # or that the entity didn't exist. We can handle entities that didn't exist
              # later, as really should 404.

              if result == 0

                if existingEntityStepSelector["identity"] == "id;new"
                  existingEntityStepSelector["identity"] = updater["$set"]["identity"]
                  existingEntityStepSelector["steps"] = []
                  updateOptions["upsert"] = true

                # When we don't have an identity, make one that's going to be unique.
                if existingEntityStepSelector["identity"] == undefined
                  existingEntityStepSelector["identity"] = new BSON.ObjectID().toString()

                if updater["$push"] == undefined
                  updater["$push"] = {};

                # At this stage, we failed to locate an existing step. If the step is repeatable
                # we can move ahead with a new identifier here.

                updater["$push"]["steps"] = {
                  "fields" : updater["$set"]["steps.$.fields"],
                  "stepDate" : updater["$set"]["steps.$.stepDate"],
                  "stepUser" : (req.user && req.user.userId) || null,
                  "stepRef" : new BSON.ObjectID(step._id.toString())
                }

                if step["isRepeatable"]
                  updater["$push"]["steps"]["id"] = existingEntityStepSelector["steps.id"]
                else
                  updater["$push"]["steps"]["id"] = new BSON.ObjectID()

                delete updater["$set"]["steps.$.fields"]
                delete updater["$set"]["steps.$.stepDate"]
                delete updater["$set"]["steps.$.stepUser"]
                delete existingEntityStepSelector['steps.stepRef']
                delete existingEntityStepSelector['steps.id']

                entities.update existingEntityStepSelector, updater, updateOptions, (err, result) ->
                  switch
                    when err
                      res.status(400).send(err)
                    when result == 0
                      res.status(400).send("Internal error inserting document")
                    else
                      res.redirect newUrl

              else
                res.redirect newUrl

## Given a set of objects, it returns an array of all the actual access
## objects present within them, omitting those that don't exist.
accessList = (values...) ->
  (access["access"] for access in values when access["access"]?)

findStepUpdater = (req, res, studyId, step, fields, errors, updater, callback) ->

  remainingFields = if fields == undefined then [] else Object.keys(fields)

  # Simple case: no more fields, we are done.
  if remainingFields.length == 0

    # Check for missing fields. These will be absent but required.
    foundFields = {}
    missingFields = []
    for field in updater["$set"]["steps.$.fields"]
      foundFields[field.key] = 1;
    if step.fields != undefined
      for own stepField of step.fields
        if step.fields[stepField].isRequired && ! foundFields[stepField]
          missingFields.push(stepField);

    # If there are missing fields, add to the error
    if missingFields.length > 0
      errors["missingFields"] = missingFields
      errors.err = "missing fields: " + missingFields.join(", ")

    # If the error is empty, make it null
    if Object.keys(errors).length == 0
      errors = null

    callback errors, updater

  else

    # Grab and remove the first property.
    fieldName = remainingFields.shift()
    fieldValue = fields[fieldName]
    delete fields[fieldName]

    # Discard if it's not a step field
    if ! step.fields.hasOwnProperty(fieldName)
      return findStepUpdater req, res, studyId, step, fields, errors, updater, callback

    # Otherwise, get the field definition.
    fieldDefinition = step.fields[fieldName]

    # Use the field type, but carefully.
    newField = {"key" : fieldName}

    if fieldDefinition.isIdentity

      if fieldValue["identity"] != undefined
        newField["identity"] = fieldValue["identity"]
        updater["$set"]["steps.$.fields"].push(newField)
        updater["$set"]["identity"] = newField["identity"]
      return findStepUpdater req, res, studyId, step, fields, errors, updater, callback

    else if fieldDefinition.type == 'Reference' && fieldDefinition.hasOwnProperty('entity')

      reference = fieldValue.ref
      role = fieldDefinition.entity
      selector =
        if      fieldValue.ref != undefined    then {_id: new BSON.ObjectID(fieldValue.ref.toString())}
        else if fieldValue.value != undefined  then {identity: fieldValue.value}
        else                                        undefined

      if selector?
        # Shouldn't throw an error. Should really be a missing field. If it's required.
        findStepUpdater req, res, studyId, step, fields, errors, updater, callback

      else

        db.collection "entities", (err, entities) ->
          entities.find(selector).limit(1).toArray (err, docs) ->
            if err
              callback db, {err: err}, null
            else if docs.length == 0
              errors.missingObject = ["role", reference.toString()];
              findStepUpdater req, res, studyId, step, fields, errors, updater, callback
            else
              entity = docs[0]
              id = new BSON.ObjectID(entity._id.toString())
              newField["ref"] = id
              updater["$set"]["steps.$.fields"].push(newField)
              findStepUpdater req, res, studyId, step, fields, errors, updater, callback

    else if ! fieldDefinition.isIdentity

      newField["value"] = fieldValue.value
      updater["$set"]["steps.$.fields"].push(newField)

      # If it's a name field, set the name too.
      if fieldDefinition.name
        updater["$set"]["name"] = newField["value"];

      findStepUpdater req, res, studyId, step, fields, errors, updater, callback

    else
      throw new Error("Should never get here!")
