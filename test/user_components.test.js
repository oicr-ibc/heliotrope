require.extensions['.testjs'] = require.extensions['.js'];

var fs = require('fs'),
    sys = require("sys"),
    mongo = require("mongodb"),
    MongoClient = mongo.MongoClient,
    should = require('should'),
    initialize = require('./initialize'),
    passport = require("passport");

module.exports.config = {
  data: {
    userdb: "mongodb://localhost:27017/user"
  },
  ldap: {
    url: "ldap://localhost",
    searchBase: "dc=oicr,dc=on,dc=ca",
    searchFilter: "(uid={{username}})"
  }
}

var authentication = require("../lib/authentication");

describe('Authentication component', function() {

  var db;

  beforeEach(function(done) {
    initialize.withDB("user", function(idb, ierr, iresult) {
      db = idb;
      done();
    });
  });

  describe('deserializeUser', function() {

    var deserializer = authentication.deserializer;

    it('should exist', function(done) {
      should.exist(deserializer);
      done();     
    })

    it('should find a known user', function(done){
      deserializer("swatt", function(err, user) {
        should.not.exist(err);
        should.exist(user || user.userId);
        should.exist(user || user.roles);
        user.userId.should.equal("swatt")
        user.roles.should.include("KB_EDITOR")
        done();
      });
    });

    it('should not find a unknown user', function(done){
      deserializer("mungo", function(err, user) {
        should.not.exist(err);
        should.not.exist(user);
        done();
      });
    });
  });
});

