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
