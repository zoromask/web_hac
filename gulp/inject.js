'use strict';

var gulp = require('gulp');
var replace = require('gulp-replace');
var paths = gulp.paths;

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;

gulp.task('inject', ['styles'], function () {

  var config = require('../configuration.json');

  var injectStyles = gulp.src([
    paths.tmp + '/serve/{app,components}/**/*.css',
    '!' + paths.tmp + '/serve/app/vendor.css'
  ], { read: false });


  var injectScripts = gulp.src([
    paths.src + '/{app,components}/**/*.js',
    '!' + paths.src + '/{app,components}/**/*.spec.js',
    '!' + paths.src + '/{app,components}/**/*.mock.js'
  ]).pipe($.angularFilesort());
  
  gulp.src(paths.src + '/app/app.js')
    .pipe(replace("@APP_VERSION", config.app_version))
    .pipe(replace("@APP_PORT", config.app_port))
    .pipe(replace("@APP_SERVICE", config.app_service))
    .pipe(gulp.dest(paths.tmp + '/serve/app/'));

	$.inject.transform.html.js = function (filepath) {
	  return '<script src="' + filepath + '?v=' + config.app_version + '.' + (new Date).getTime() + '"></script>"';
	}
	
  var injectOptions = {
    ignorePath: [paths.src, paths.tmp + '/serve'],
    addRootSlash: false,
	transform: function (filepath) {
		return $.inject.transform.apply($.inject.transform, arguments);
	}
  };

  var wiredepOptions = {
    directory: 'bower_components',
    //exclude: [/bootstrap\.js/, /bootstrap\.css/, /bootstrap\.css/, /foundation\.css/]
  };

  delete require.cache[require.resolve('../configuration.json')];
  
  return gulp.src(paths.src + '/*.html')
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(wiredepOptions))
    .pipe(gulp.dest(paths.tmp + '/serve'));

});

gulp.task('inject-build', ['styles'], function () {

  var injectStyles = gulp.src([
    paths.tmp + '/serve/{app,components}/**/*.css',
    '!' + paths.tmp + '/serve/app/vendor.css'
  ], { read: false });


  var injectScripts = gulp.src([
    paths.src + '/{app,components}/**/*.js',
    '!' + paths.src + '/{app,components}/**/*.spec.js',
    '!' + paths.src + '/{app,components}/**/*.mock.js'
  ]).pipe($.angularFilesort());
  
  var injectOptions = {
    ignorePath: [paths.src, paths.tmp + '/serve'],
    addRootSlash: false
  };

  var wiredepOptions = {
    directory: 'bower_components',
    //exclude: [/bootstrap\.js/, /bootstrap\.css/, /bootstrap\.css/, /foundation\.css/]
  };
  
  return gulp.src(paths.src + '/*.html')
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(wiredepOptions))
    .pipe(gulp.dest(paths.tmp + '/serve'));

});
