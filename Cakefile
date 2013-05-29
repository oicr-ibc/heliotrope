# Cakefile

{exec} = require "child_process"

REPORTER = "list"

task "test", "run tests", ->
  exec "NODE_ENV=test 
    ./node_modules/mocha/bin/mocha 
    --reporter #{REPORTER}
    --colors
  ", (err, output) ->
    throw err if err
    console.log output
