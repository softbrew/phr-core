'use strict';

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var webpack = require('gulp-webpack');
var concat = require('gulp-concat');
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');

var errorReporter = function(files) {
    return files.map(function(file, cb) {
        if (!file.jshint.success) {
            process.exit(1);
        }
        cb(null, file);
    });
};

const paths = {
    scripts: ['src/index.js', 'src/lib/**/*.js', 'src/server/**/*.js',
        'src/routes/*.js'
    ],
    hints: ['src/lib/**/*.js', 'src/server/**/*.js', 'test/**/*.js']
};

gulp.task('default', () => {
    return gulp.src('src/index.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('dist/'));
});

gulp.task('develop', () => {
    process.env.DEBUG = 'src:*';

    return nodemon({
            script: './dist/server.js',
            ext: 'js',
            // WARNING: Need to remove `dist` to avoid looping
            ignore: ['dist', 'node_modules', 'bower_components'],
            tasks: ['default']
        })
        .on('restart', () => {
            console.log('restarted!');
        });
});

gulp.task('test', function() {
    return gulp.src(['tests/server.js', 'tests/**/*.js'])
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
            'strict': false,
            'globals': {
                'logger': false,
                'models': false,
                'appRoot': false
            }
        }))
        .pipe(jshint.reporter('default'))
        .pipe(errorReporter());
});

// NOTE: Working, but concat all file together
gulp.task('babel', function() {
    return gulp.src('src/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('server.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});
