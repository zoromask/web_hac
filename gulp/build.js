'use strict';

var gulp = require('gulp');
var chmod = require('gulp-chmod');
var ngAnnotate = require('gulp-ng-annotate');
var replace = require('gulp-replace');
var config = require('../configuration.json');
var paths = gulp.paths;

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('partials', function () {
  return gulp.src([
    paths.src + '/{app,components}/**/*.html',
    paths.tmp + '/{app,components}/**/*.html'
  ])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'inspinia'
    }))
    .pipe(gulp.dest(paths.tmp + '/partials/'));
});

gulp.task('html', ['inject-build', 'partials'], function () {
  var partialsInjectFile = gulp.src(paths.tmp + '/partials/templateCacheHtml.js', { read: false });
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: paths.tmp + '/partials',
    addRootSlash: false
  };

  var htmlFilter = $.filter('*.html');
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var assets;

  return gulp.src(paths.tmp + '/serve/*.html')
    .pipe($.inject(partialsInjectFile, partialsInjectOptions))
    .pipe(assets = $.useref.assets())
    .pipe($.rev())
    .pipe(jsFilter)
    .pipe(ngAnnotate())
    .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.replace('../bootstrap/fonts', 'fonts'))
    .pipe($.csso())
    .pipe(cssFilter.restore())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest(paths.dist + '/'))
    .pipe($.size({ title: paths.dist + '/', showFiles: true }));
});

gulp.task('images', function () {
  return gulp.src(paths.src + '/assets/images/**/*')
    .pipe(chmod(755))
    .pipe(gulp.dest(paths.dist + '/assets/images/'));
});

gulp.task('fonts', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest(paths.dist + '/fonts/'));
});

gulp.task('fontawesome', function () {
    return gulp.src('bower_components/font-awesome/fonts/*.{eot,svg,ttf,woff}')
     .pipe(gulp.dest(paths.dist + '/fonts/'));
});

gulp.task('fontclingme', function () {
    return gulp.src('src/app/fonts/*.{eot,svg,ttf,woff}')
     .pipe(gulp.dest(paths.dist + '/fonts/'));
});

gulp.task('misc', function () {
  return gulp.src(paths.src + '/**/*.ico')
    .pipe(gulp.dest(paths.dist + '/'));
});

gulp.task('module', function () {
  return gulp.src(paths.src + '/app/**/*.js')
    .pipe(replace("@APP_VERSION", config.app_version))
    .pipe(replace("@APP_PORT", config.app_port))
    .pipe(replace("@APP_SERVICE", config.app_service))
    .pipe(ngAnnotate())
    .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
    .pipe(gulp.dest(paths.dist + '/app/'));
});

gulp.task('translation', function () {
  return gulp.src('translation/*.json')
    .pipe(gulp.dest(paths.dist + '/translation/'));
});

gulp.task('clean', function (done) {
  $.del([paths.dist + '/', paths.tmp + '/'], done);
});

gulp.task('build', ['html', 'images', 'fonts', 'fontclingme', 'misc', 'module', 'translation']);
