# Cakefile

{print} = require 'sys'

{exec} = require "child_process"

{spawn} = require "child_process"

REPORTER = "list"

task "test", "run tests", ->
  exec "NODE_ENV=test 
    ./node_modules/mocha/bin/mocha 
    --reporter #{REPORTER}
    --colors
  ", (err, output) ->
    throw err if err
    console.log output

task "build", 'Compile the CoffeeScript', ->
  coffee = spawn 'coffee', ['-c', '-o', 'webapp/app/js', 'webapp/app/coffee']
  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  coffee.stdout.on 'data', (data) ->
    print data.toString()

task "watch", 'Watch src for changes', ->
  coffee = spawn 'coffee', ['-w', '-c', '-o', 'webapp/app/js', 'webapp/app/coffee']
  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  coffee.stdout.on 'data', (data) ->
    print data.toString()

task "server", 'Start the command-line', ->
  coffee = spawn 'node', ['server.js']
  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  coffee.stdout.on 'data', (data) ->
    print data.toString()
  coffee.on 'error', (error) ->
    process.stderr.write data.toString()
