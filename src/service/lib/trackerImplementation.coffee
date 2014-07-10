module.exports.log4js = module.parent.exports.log4js
module.exports.logger = module.parent.exports.logger

sys =             require("sys")
mongo =           require("mongodb")
MongoClient =     mongo.MongoClient
BSON =            mongo.BSONPure

logger = module.exports.logger

module.exports.initialize = () ->
  MongoClient.connect "mongodb://localhost:27017/tracker", (err, db) ->
    indexes = []
    addIndexes = () ->
      if indexes.length > 0
        index = indexes.shift()
        db.createIndex index["collection"], index["index"], addIndexes
    addIndexes()

module.exports.connected = (url, callback) ->
  (req, res) ->
    MongoClient.connect url, (err, db) ->
      callback(err, db, req, res)

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

module.exports.getStudies = (err, db, req, res, callback) ->
  db.collection "studies", (err, studies) ->
    studies.find({}).toArray (err, docs) ->
      if err
        callback db, {err: err}, null, res
      else
        results = {}
        for doc in docs
          doc.url = "/studies/" + doc.name
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
          entities.aggregate statistics, (err, stats) ->

            for stat in stats
              studyId = stat["_id"]["studyId"].toString()
              role = stat["_id"]["role"]
              delete stat["_id"]
              results[studyId]["statistics"][role] = stat
              results[studyId]["lastModified"] = stat["lastModified"] if !results[studyId]["lastModified"]
              results[studyId]["lastModified"] = stat["lastModified"] if stat["lastModified"] > results[studyId]["lastModified"]

            result = new Object
            result["data"] = (results[key] for own key of results)
            callback db, err, result, res, 200

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

      newUrl = "/studies/" + encodeURIComponent(body["data"]["name"])

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
module.exports.getStudy = (err, db, req, res, callback) ->
  findStudy db, req, res, 'read', (err, doc) ->

    if err || ! doc
      callback db, err, doc, res, res.locals.statusCode || 404

    else
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
          callback db, "Can't find query: " + name, {"error" : "Can't find query: " + name}, res
        else
          collectionName = queryRecord["collection"] || "entities"
          pipeline = queryRecord["pipeline"]

          query["studyId"] = studyId
          modified = completePlaceholders(req, pipeline)

          db.collection collectionName, (err, collection) ->
            collection.aggregate modified, (err, results) ->
              queryRecord["updater"](doc, results) if queryRecord["updater"] != undefined
              result = new Object
              result["data"] = results
              callback db, err, result, res, 200

      else
        countsQuery = getCountsQuery(studySelector)
        stepsQuery = getStepsQuery(studySelector)

        annotateEntity db, doc, [countsQuery, stepsQuery], (o) ->
          callback db, err, {data: o}, res, 200

## Helper function to asynchronously find a study.
##
## @param db - the MongoDB connection
## @param req - the request
## @param res - the response
## @param callback - a callback, taking an error status and the resulting study

findStudy = (db, req, res, mode, callback) ->
  name = req.params.study
  db.collection "studies", (err, studies) ->

    selector = if (name.substr(0, 3) == "id;") then {"_id": new BSON.ObjectID(name.substring(3))} else {name: name}
    studies.find(selector).limit(1).toArray (err, docs) ->

      switch
        when err then callback err, null
        when docs.length == 0 then callback {error: "Not Found"}, null
        else

          # If we get a study back, but the requested user is not allowed access to it, then we
          # can simply refuse access. The callback needs to be subtle enough to distingish between
          # a status of 404 (not found) and 403 (forbidden). We do this by setting a local value for
          # a status when it's forbidden. Note that an authorization error is not a 401 -- that's
          # only for HTTP authorization and we are beyond that. For more information on that issue:
          # http://stackoverflow.com/questions/3297048/403-forbidden-vs-401-unauthorized-http-responses
          #
          # As an exception, obviously, administrative users (e.g., me) can always get access. And that's
          # a user role.

          doc = docs[0]
          doc.url = "/studies/" + doc.name

          if checkAdminAccess(req, mode) || checkAccessList(req, accessList(doc), mode)
            callback null, doc
          else
            res.locals.statusCode = 403;
            callback {error: "Forbidden"}, null


## Helper function to asynchronously find an entity.
## @param db
## @param req
## @param callback

findEntity = (db, studyId, role, identity, callback) ->
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

    entities.find(selector).limit(1).toArray (err, docs) ->
      if err
        callback err, null
      else
        callback null, docs[0]

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

module.exports.getViews = (err, db, req, res, callback) ->
  name = req.params.study
  role = req.params.role

  findStudy db, req, res, 'read', (err, doc) ->

    if err || ! doc
      callback(db, err, doc, res, res.locals.statusCode || 404)
    else
      selector = {"studyId": new BSON.ObjectID(doc._id.toString())}
      selector["role"] = role if role

      db.collection "views", (err, views) ->
        cursor = views.find(selector)
        cursor.toArray (err, results) ->
          results.sort(compareViews)

          # If we're not using a role, structure the response accordingly.
          if role
            callback db, err, {data: {study: doc, views: results}}, res, 200
          else
            result = {}
            for view in results
              result[view["role"]] = [] if ! result[view["role"]]?
              result[view["role"]].push(view)

            callback db, err, {data: {study: doc, views: result}}, res, 200

## Database endpoint to read a single entity.
## @param studyName
## @param role
## @param identity
## @param callback
module.exports.getEntity = (err, db, req, res, callback) ->
  role = req.params.role
  identity = req.params.identity
  userId = req.user.userId

  logger.info "Called getEntity"

  findStudy db, req, res, 'read', (err, doc) ->

    if err || ! doc
      return callback(db, err, doc, res, res.locals.statusCode || 404)

    studyId = new BSON.ObjectID(doc._id.toString())

    findEntity db, studyId, role, identity, (err, entity) ->

      if err
        return callback db, {err: err}, null, res
      else if entity == undefined
        return callback db, {err: "Missing entity: " + role + ", " + identity}, null, res

      entity.study = doc
      entity.notes = (doc.nodes && doc.notes[role]) || {}
      entity.url = doc.url + "/" + role + "/" + identity

      # Find all the available steps
      stepSelector = {"studyId" : studyId, "appliesTo" : role}

      # Now locate the requested entity
      db.collection "steps", (err, steps) ->
        steps.find(stepSelector).toArray (err, allStepsArray) ->

          stepsArray = allStepsArray.sort(compareViews)
          stepsArray = (step for step in stepsArray when checkAdminAccess(req, 'read') || checkAccessList(req, accessList(step, doc), 'read'))

          # And finally, related entities.
          relatedSelector = buildRelatedEntitySelector(entity)
          db.collection "entities", (err, entities) ->
            entities.find(relatedSelector).toArray (err, related) ->
              result = {data: entity}

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
                plugin = entity.notes.readEntity
                return maybeInterceptedCallback(plugin, db, err, result, req, res, callback)

maybeInterceptedCallback = (plugin, db, err, result, req, res, callback) ->
  if plugin
    module = plugin["module"]
    method = plugin["method"]
    loadedModule = require("./plugins/" + module)
    method = loadedModule[method]
    method db, err, result, req, res, callback
  else
    callback db, err, result, res, 200

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
  for field in fields
    record = fields[field]
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

  console.log sys.inspect(stepsArray)
  for step in stepsArray
    for own fieldName, field of step.fields
      fields[field] = step.fields[field]

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
  while start != end
    next = value.indexOf(".", start)
    element = value.slice(start, (if (next == -1) then end else next))
    if object.hasOwnProperty(element)
      object = object[element]
    else
      throw new EvalError("Missing property: " + originalValue)
    if object.hasOwnProperty(element)
      object = object[element]
      if next == -1
        return object
      else
        start = next + 1
