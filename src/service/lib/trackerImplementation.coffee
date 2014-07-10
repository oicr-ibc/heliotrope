module.exports.log4js = module.parent.exports.log4js
module.exports.logger = module.parent.exports.logger

mongo =           require("mongodb")
MongoClient =     mongo.MongoClient

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
