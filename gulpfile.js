"use strict;"

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var babel = require('babel/register');
var jshint = require('gulp-jshint');

var errorReporter = function() {
  return map(function(file, cb) {
    if (!file.jshint.success) {
      process.exit(1);
    }
    cb(null, file);
  });
};

var paths = {
  scripts: ['lib/**/*.js', 'server/**/*.js', 'config/*.js'],
  hints: ['lib/**/*.js', 'server/**/*.js', 'test/**/*.js']
};

gulp.task('default', function() {
  return gulp.src("src/**/*.js")
    .pipe(babel())
    .pipe(gulp.dest("dist"));
});

gulp.task('test', function() {
  return gulp.src(['tests/bootstrap.js', 'tests/**/*.js'])
    .pipe(mocha({
      compilers: {
        js: babel
      }
    }))
    .once('error', function() {
      process.exit(1);
    })
    .once('end', function() {
      process.exit();
    });
});

gulp.task('test-watch', function() {
  gulp.watch(['tests/**/*.js'], ['test']);
});

// JS hint task
gulp.task('jshint', function() {
  gulp.src(paths.hints)
    .pipe(jshint({
      "strict": false,
      "globals": {
        "logger": false,
        "models": false,
        "appRoot": false
      }
    }))
    .pipe(jshint.reporter('default'))
    .pipe(errorReporter());
});
