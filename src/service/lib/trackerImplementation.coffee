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
        db.createIndex(index["collection"], index["index"], addIndexes)
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
