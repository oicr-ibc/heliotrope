# Cakefile

{print} = require 'sys'

{spawn} = require "child_process"

fs = require 'fs'

REPORTER = "list"

commonFolders = [
  'lib/common'
]

webappCoffeeSource = 'webapp/app/coffee'

webappJavaScriptSource = 'webapp/app/js'

webappVendorSource = 'webapp/app/vendor'

task "test", "run tests", ->
  tester = spawn 'node', ['./node_modules/mocha/bin/mocha', '--reporter', REPORTER, '--colors']
  tester.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  tester.stdout.on 'data', (data) ->
    print data.toString()

task "clean", "Clean generated code", ->
  remove = spawn 'rm', ['-r', '-f', webappJavaScriptSource]
  remove.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  remove.stdout.on 'data', (data) ->
    print data.toString()
  fs.mkdirSync webappJavaScriptSource

task "build", 'Build sources', ->
  for folder in commonFolders  
    cp = spawn 'cp', ['-r', '-f', folder + "/", webappJavaScriptSource]
    cp.stderr.on 'data', (data) ->
      process.stderr.write data.toString()
    cp.stdout.on 'data', (data) ->
      util.log data.toString()
  coffee = spawn 'coffee', ['-c', '-o', webappJavaScriptSource, webappCoffeeSource]
  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  coffee.stdout.on 'data', (data) ->
    print data.toString()

task "watch", 'Watch src for changes', ->
  coffee = spawn 'coffee', ['-w', '-c', '-o', webappJavaScriptSource, webappCoffeeSource]
  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  coffee.stdout.on 'data', (data) ->
    print data.toString()

task "server", 'Start the command-line', ->
  invoke "build"
  coffee = spawn 'node', ['server.js']
  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  coffee.stdout.on 'data', (data) ->
    print data.toString()
  coffee.on 'error', (error) ->
    process.stderr.write data.toString()
