/* jshint node: true */
'use strict';

var gulp = require('gulp'),
    g = require('gulp-load-plugins')({lazy: false}),
    noop = g.util.noop,
    es = require('event-stream'),
    queue = require('streamqueue'),
    lazypipe = require('lazypipe'),
    stylish = require('jshint-stylish'),
    bower = require('./bower'),
    url = require('url'),
    proxy = require('proxy-middleware'),
    pushState = require('connect-pushstate/lib/pushstate').pushState(),
    isWatching = false;

// When we have a URL that matches ^/api/, wejust forward, otherwise we
// do the pushstate thing. This allows the embedded service/nodemon to
// pick up immediately.
var conditionalPushStateMiddleware = function(req, res, next) {
  var pathname = url.parse(req.url).pathname;
  if (!pathname.match(/^\/api\//)) {
    pushState(req, res, next);
  } else {
    next();
  }
};

// Proxy for /api/ from 3000 -> 3001.
var proxyOptions = url.parse('http://localhost:3001/api');
proxyOptions.route = '/api';

var htmlminOpts = {
  removeComments: true,
  collapseWhitespace: true,
  removeEmptyAttributes: false,
  collapseBooleanAttributes: true,
  removeRedundantAttributes: true
};

/**
 * JS Hint
 */
gulp.task('jshint', function () {
  return gulp.src([
    './gulpfile.js',
    './src/app/**/*.js'
  ])
    .pipe(g.cached('jshint'))
    .pipe(jshint('./.jshintrc'))
    .pipe(livereload());
});

/**
 * CSS
 */
gulp.task('clean-css', function () {
  return gulp.src('./.tmp/css').pipe(g.clean());
});

gulp.task('styles', ['clean-css'], function () {
  return gulp.src([
    './src/app/**/*.scss',
    '!./src/app/**/_*.scss'
  ])
    .pipe(g.sass())
    .pipe(gulp.dest('./.tmp/css/'))
    .pipe(g.cached('built-css'))
    .pipe(livereload());
});

gulp.task('styles-dist', ['styles'], function () {
  return cssFiles().pipe(dist('css', bower.name));
});

gulp.task('csslint', ['styles'], function () {
  return cssFiles()
    .pipe(g.cached('csslint'))
    .pipe(g.csslint('./.csslintrc'))
    .pipe(g.csslint.reporter());
});

/**
 * CoffeeScript
 */
gulp.task('coffee', function () {
  return gulp.src([
    './src/app/**/*.*coffee'
  ])
    .pipe(g.coffee())
    .pipe(gulp.dest('./.tmp/src/app'));
});
gulp.task('coffee-service', function () {
  return gulp.src([
    './src/service/**/*.*coffee'
  ])
    .pipe(g.coffee())
    .pipe(gulp.dest('./.tmp/src/service'));
});

/**
 * Scripts
 */
gulp.task('scripts-dist', ['templates-dist'], function () {
  return appFiles().pipe(dist('js', bower.name, {ngmin: true}));
});

/**
 * Templates
 */
gulp.task('templates', function () {
  return templateFiles().pipe(buildTemplates());
});

gulp.task('templates-dist', function () {
  return templateFiles({min: true}).pipe(buildTemplates());
});

/**
 * Vendors
 */
gulp.task('vendors', function () {
  var bowerStream = g.bowerFiles();
  return es.merge(
    bowerStream.pipe(g.filter('**/*.css')).pipe(dist('css', 'vendors')),
    bowerStream.pipe(g.filter('**/*.js')).pipe(dist('js', 'vendors'))
  );
});

/**
 * Index
 */
gulp.task('index', index);
gulp.task('build-all', ['styles', 'templates', 'coffee', 'coffee-service'], index);

function index () {
  var opt = {read: false};
  return gulp.src('./src/app/index.html')
    .pipe(g.inject(g.bowerFiles(opt), {ignorePath: 'bower_components', starttag: '<!-- inject:vendor:{{ext}} -->'}))
    .pipe(g.inject(es.merge(appFiles(), cssFiles(opt)), {ignorePath: ['.tmp', 'src/app']}))
    .pipe(gulp.dest('./src/app/'))
    .pipe(g.embedlr())
    .pipe(gulp.dest('./.tmp/'))
    .pipe(livereload());
}

/**
 * Assets
 */
gulp.task('assets', function () {
  return gulp.src('./src/app/assets/**')
    .pipe(gulp.dest('./dist/assets'));
});

/**
 * Dist
 */
gulp.task('dist', ['vendors', 'assets', 'styles-dist', 'scripts-dist'], function () {
  return gulp.src('./src/app/index.html')
    .pipe(g.inject(gulp.src('./dist/vendors.min.{js,css}'), {ignorePath: 'dist', starttag: '<!-- inject:vendor:{{ext}} -->'}))
    .pipe(g.inject(gulp.src('./dist/' + bower.name + '.min.{js,css}'), {ignorePath: 'dist'}))
    .pipe(g.htmlmin(htmlminOpts))
    .pipe(gulp.dest('./dist/'));
});

/**
 * Static file server
 */
gulp.task('statics', g.serve({
  port: 3000,
  root: ['./.tmp', './.tmp/src/app', './src/app', './bower_components'],
  middlewares: [conditionalPushStateMiddleware, proxy(proxyOptions)]
}));

/**
 * Watch
 */
gulp.task('serve', ['watch']);
gulp.task('watch', ['statics', 'default'], function () {
  isWatching = true;
  // Initiate livereload server:
  g.livereload();
  gulp.watch('./src/app/**/*.*coffee', ['coffee']).on('change', function (evt) {
    if (evt.type !== 'changed') {
      gulp.start('index');
    }
  });
  gulp.watch('./src/service/**/*.*coffee', ['coffee-service']);
  gulp.watch('./src/app/index.html', ['index']);
  gulp.watch(['./src/app/**/*.html', '!./src/app/index.html'], ['templates']);
  gulp.watch(['./src/app/**/*.scss'], ['csslint']).on('change', function (evt) {
    if (evt.type !== 'changed') {
      gulp.start('index');
    }
  });
  g.nodemon({ script: '.tmp/src/service/main.js', watch: ['.tmp/src/service'] })
    .on('restart', function () {
      console.log('restarted!');
    });
});

/**
 * Default task
 */
gulp.task('default', ['lint', 'build-all']);

/**
 * Lint everything
 */
gulp.task('lint', ['jshint', 'csslint']);

/**
 * Test
 */
gulp.task('test', ['templates', 'coffee'], function () {
  return testFiles()
    .pipe(g.karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }));
});

/**
 * Inject all files for tests into karma.conf.js
 * to be able to run `karma` without gulp.
 */
gulp.task('karma-conf', ['templates'], function () {
  return gulp.src('./karma.conf.js')
    .pipe(g.inject(testFiles(), {
      starttag: 'files: [',
      endtag: ']',
      addRootSlash: false,
      transform: function (filepath, file, i, length) {
        return '  \'' + filepath + '\'' + (i + 1 < length ? ',' : '');
      }
    }))
    .pipe(gulp.dest('./'));
});

/**
 * Test files
 */
function testFiles() {
  return new queue({objectMode: true})
    .queue(g.bowerFiles().pipe(g.filter('**/*.js')))
    .queue(gulp.src('./bower_components/angular-mocks/angular-mocks.js'))
    .queue(appFiles())
    .queue(gulp.src(['./src/app/**/*_test.js', './.tmp/src/app/**/*_test.js']))
    .done();
}

/**
 * All CSS files as a stream
 */
function cssFiles (opt) {
  return gulp.src('./.tmp/css/**/*.css', opt);
}

/**
 * All AngularJS application files as a stream
 */
function appFiles () {
  var files = [
    './.tmp/' + bower.name + '-templates.js',
    './.tmp/src/app/**/*.js',
    '!./.tmp/src/app/**/*_test.js',
    './src/app/**/*.js',
    '!./src/app/**/*_test.js'
  ];
  return gulp.src(files)
    .pipe(g.angularFilesort());
}

/**
 * All AngularJS templates/partials as a stream
 */
function templateFiles (opt) {
  return gulp.src(['./src/app/**/*.html', '!./src/app/index.html'], opt)
    .pipe(opt && opt.min ? g.htmlmin(htmlminOpts) : noop());
}

/**
 * Build AngularJS templates/partials
 */
function buildTemplates () {
  return lazypipe()
    .pipe(g.ngHtml2js, {
      moduleName: bower.name + '-templates',
      prefix: '/' + bower.name + '/',
      stripPrefix: '/src/app'
    })
    .pipe(g.concat, bower.name + '-templates.js')
    .pipe(gulp.dest, './.tmp')
    .pipe(livereload)();
}

/**
 * Concat, rename, minify
 *
 * @param {String} ext
 * @param {String} name
 * @param {Object} opt
 */
function dist (ext, name, opt) {
  opt = opt || {};
  return lazypipe()
    .pipe(g.concat, name + '.' + ext)
    .pipe(gulp.dest, './dist')
    .pipe(opt.ngmin ? g.ngmin : noop)
    .pipe(opt.ngmin ? g.rename : noop, name + '.annotated.' + ext)
    .pipe(opt.ngmin ? gulp.dest : noop, './dist')
    .pipe(ext === 'js' ? g.uglify : g.minifyCss)
    .pipe(g.rename, name + '.min.' + ext)
    .pipe(gulp.dest, './dist')();
}

/**
 * Livereload (or noop if not run by watch)
 */
function livereload () {
  return lazypipe()
    .pipe(isWatching ? g.livereload : noop)();
}

/**
 * Jshint with stylish reporter
 */
function jshint (jshintfile) {
  return lazypipe()
    .pipe(g.jshint, jshintfile)
    .pipe(g.jshint.reporter, stylish)();
}
