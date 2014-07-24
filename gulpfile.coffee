browserify = require 'browserify'
CSSmin     = require 'gulp-minify-css'
ecstatic   = require 'ecstatic'
gulp       = require 'gulp'
gutil      = require 'gulp-util'
jade       = require 'gulp-jade'
livereload = require 'gulp-livereload'
path       = require 'path'
plumber    = require 'gulp-plumber'
prefix     = require 'gulp-autoprefixer'
rename     = require 'gulp-rename'
source     = require 'vinyl-source-stream'
streamify  = require 'gulp-streamify'
stylus     = require 'gulp-stylus'
templates  = require 'gulp-angular-templatecache'
uglify     = require 'gulp-uglify'
watchify   = require 'watchify'
es         = require 'event-stream'

production = process.env.NODE_ENV is 'production'

paths =
  scripts:
    source: './src/app.js'
    destination: './public/js/'
    filename: 'bundle.js'

  templates:
    main: './src/index.jade'
    source: './src/**/*.jade'
    watch: './src/**/*.jade'
    destination: './public/'

  styles:
    source: './src/style.styl'
    watch: './src/**/*.styl'
    destination: './public/css/'

  assets:
    source: './src/assets/**/*.*'
    watch: './src/assets/**/*.*'
    destination: './public/'

handleError = (err) ->
  gutil.log err
  gutil.beep()
  this.emit 'end'

gulp.task 'scripts', ['templates'], ->

  bundle = browserify
    entries: [paths.scripts.source]

  build = bundle.bundle(debug: not production)
    .on 'error', handleError
    .pipe source paths.scripts.filename

  build.pipe(streamify(uglify())) if production

  build
    .pipe gulp.dest paths.scripts.destination


compileTemplates = ->
  main = gulp
    .src paths.templates.main
    .pipe jade pretty: not production
    .on 'error', handleError
    .pipe gulp.dest paths.templates.destination

  tpls = gulp
    .src [paths.templates.source, "!#{paths.templates.main}"]
    .pipe jade pretty: not production
    .on 'error', handleError
    .pipe templates 'templates.js'
    .pipe gulp.dest 'tmp'

  pipeline = es.merge main, tpls
  pipeline = pipeline.pipe livereload() unless production
  pipeline

gulp.task 'templates', compileTemplates

gulp.task 'styles', ->
  styles = gulp
    .src paths.styles.source
    .pipe(stylus({set: ['include css']}))
    .on 'error', handleError
    .pipe prefix 'last 2 versions', 'Chrome 34', 'Firefox 28', 'iOS 7'

  styles = styles.pipe(CSSmin()) if production

  pipeline = styles.pipe gulp.dest paths.styles.destination
  pipeline = pipeline.pipe livereload() unless production
  pipeline

gulp.task 'assets', ->
  gulp
    .src paths.assets.source
    .pipe gulp.dest paths.assets.destination

gulp.task 'server', ->
  require('http')
    .createServer ecstatic root: __dirname + '/public'
    .listen 9002

gulp.task "watch", ->
  livereload.listen()

  gulp.watch paths.styles.watch, ['styles']
  gulp.watch paths.assets.watch, ['assets']

  bundle = watchify
    entries: [paths.scripts.source]

  bundle.on 'update', ->
    build = bundle.bundle(debug: not production)
      .on 'error', handleError

      .pipe source paths.scripts.filename

    build
      .pipe gulp.dest paths.scripts.destination
      .pipe(livereload())

  .emit 'update'

  gulp.watch paths.templates.watch, compileTemplates

gulp.task "build", ['scripts', 'templates', 'styles', 'assets']
gulp.task "default", ["build", "watch", "server"]
