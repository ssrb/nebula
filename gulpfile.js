var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var browserifyShader = require("browserify-shader")
var watchify = require('watchify');
var tsify = require('tsify');
var uglify = require('uglifyify');
var typings = require('gulp-typings');
var runSequence = require('run-sequence');
var gutil = require('gulp-util');

gulp.task('.bower.install', function () {
    var bower = require('gulp-bower');
    return bower();
});
 
gulp.task('.bower.clean', function (cb) {
    var del = require('del');
    del(['lib/'], cb);
});

gulp.task('.typings.install', function (callback) {
    return gulp.src("./typings.json").pipe(typings());
});

gulp.task('.npm.clean', function (cb) {
    var del = require('del');
    del(['node_modules/'], cb);
});

gulp.task('watch', function() {
    var bundler = watchify(browserify({debug: true})
        .add('stargazer.ts')
        .plugin(tsify)
        .transform(browserifyShader));

    bundler.on('update', rebundle)
 
    function rebundle () {
        return bundler.bundle()
          .pipe(source('bundle.js'))
          .pipe(gulp.dest('.'))
    }
     
    return rebundle();
});

gulp.task('.stargazer', function() {
    var bundler = browserify({debug: true})
        .add('./stargazer.ts')
        .plugin(tsify)
        .transform(browserifyShader)
        .transform('brfs')
    
    return bundler.bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('.'));
});

gulp.task('.stargazer.release', function() {
    var bundler = browserify()
        .add('./stargazer.ts')
        .plugin(tsify)
        .transform(browserifyShader)
        .transform('brfs')
        .transform(uglify);
    
    return bundler.bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('.'));
});

gulp.task('default', function(callback) {
    runSequence('.bower.install',
                '.typings.install',
                '.stargazer.release',
                callback);
});


