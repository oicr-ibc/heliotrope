# Cakefile

{print} = require 'sys'

{spawn} = require "child_process"
{exec} = require 'child_process'

fs = require 'fs'
util = require 'util'
async = require "async"

REPORTER = "list"

commonFolders = [
  'lib/common'
]

webappCoffeeSource = 'webapp/app/coffee'

webappJavaScriptSource = 'webapp/app/js'

webappVendorSource = 'webapp/app/vendor'

target = 'target'

packageTarget = "#{target}/package"

task "test", "run tests", ->
  tester = spawn 'node', ['./node_modules/mocha/bin/mocha', '--reporter', REPORTER, '--colors']
  tester.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  tester.stdout.on 'data', (data) ->
    print data.toString()

task "clean", "Clean generated code", ->
  util.log "Cleaning " + webappJavaScriptSource + ", " + target
  remove = spawn 'rm', ['-r', '-f', webappJavaScriptSource, target]
  remove.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  remove.stdout.on 'data', (data) ->
    print data.toString()
  remove.on 'exit', (code) ->
    fs.mkdirSync webappJavaScriptSource

copyRecursively = (from, to, callback) ->
  util.log "Copying " + from + " to " + to
  cp = spawn 'cp', ['-r', '-f', from + "/", to]
  cp.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  cp.stdout.on 'data', (data) ->
    util.log data.toString()
  cp.on 'exit', (code) ->
    callback()

merge = (cb) ->
  copyFiles = (folder, callback) ->
    copyRecursively(folder, webappJavaScriptSource, callback)
  async.eachSeries commonFolders, copyFiles, cb

compile = (options, callback) ->
  util.log "Compiling " + webappCoffeeSource + " to " + webappJavaScriptSource
  coffee = spawn 'coffee', options.concat('-c', '-o', webappJavaScriptSource, webappCoffeeSource)
  coffee.stderr.on 'data', (data) ->
    process.stderr.write data.toString()
  coffee.stdout.on 'data', (data) ->
    print data.toString()
  coffee.on 'exit', (code) ->
    callback()

ensureDirectory = (directory, callback) ->
  fs.stat directory, (err, stats) ->
    if err
      util.log "Creating " + directory
      fs.mkdir directory, (err) ->
        callback(err)
    else if stats.isDirectory()
      callback(null)
    else 
      callback("Already exists: " + directory)

prepackage = (callback) ->
  async.eachSeries ["#{target}", "#{packageTarget}", "#{packageTarget}/usr", "#{packageTarget}/usr/share", "#{packageTarget}/etc"],
    ensureDirectory,
    (err) ->
      try
        package_file = 'package.json'
        packageData = JSON.parse("#{fs.readFileSync package_file}")
        packageData["date"] = (new Date()).toLocaleString()
        util.log "Building " + packageData['name'] + " version " + packageData['version']

        copyRecursively "etc/debian", "#{packageTarget}/debian", () ->

          util.log "Filtering #{packageTarget}/debian"
          cmd = "find '#{packageTarget}/debian' -type f -exec perl -pi -e 's/\\@project.version\\@/#{packageData.version}/g; s/\\@date\\@/#{packageData.date}/g' {} \\\;"
          filter = exec cmd, (error, stdout, stderr) ->
            
            util.error 'stderr: ' + stderr if stderr
            util.error 'exec error: ' + error if error

            callback() if typeof callback is 'function'

      catch e
        util.error e, package_file

buildPackage = (callback) ->
  prepackage ->
    debuild = exec 'debuild -b -us -uc', {"cwd": "#{packageTarget}"}, (error, stdout, stderr) ->
      if error
        util.error 'exec error: ' + error
      else
        util.log 'stdout: ' + stdout if stdout
        util.error 'stderr: ' + stderr if stderr
      callback()

task "merge", "Merge JavaScript sources", () ->
  merge () ->

task "build", 'Build sources', ->
  merge () ->
    compile [], () ->

task "watch", 'Watch src for changes', ->
  compile ['-w'], () ->

task "server", 'Start the command-line', ->
  merge () ->
    compile [], () ->
      util.log "Starting server"
      coffee = spawn 'node', ['server.js']
      coffee.stderr.on 'data', (data) ->
        process.stderr.write data.toString()
      coffee.stdout.on 'data', (data) ->
        print data.toString()
      coffee.on 'error', (error) ->
        process.stderr.write data.toString()

task "package", 'Build a Debian package', ->
  buildPackage () ->
