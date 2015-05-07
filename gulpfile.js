var gulp = require('gulp'),
    del = require('del'),
    run = require('gulp-run'),
    less = require('gulp-less'),
    browserify = require('browserify'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync'),
    reactify = require('reactify'),
    package = require('./package.json'),
    source = require('vinyl-source-stream'),
    reload = browserSync.reload;

    /**
 * Running Bower
 */
gulp.task('bower', function() {
  run('bower install').exec();
})

/**
 * Cleaning dist/ folder
 */
.task('clean', function(cb) {
  del(['dist/**'], cb);
})

/**
 * Running livereload server
 */
.task('server',['copyhtml','less','js'], function() {
  browserSync({
    server: {
     baseDir: './dist'
    }
  });
})

.task('copyhtml', ['clean'], function(){
  return gulp.src(package.paths.html)
  .pipe(gulp.dest(package.dest.dist));
})
/**
 * Less compilation
 */
.task('less', function() {
  return gulp.src(package.paths.less)
  .pipe(less())
  .pipe(concat(package.dest.style))
  .pipe(gulp.dest(package.dest.dist));
})

/** JavaScript compilation */
.task('js', function() {
  return browserify(package.paths.main)
  .transform(reactify)
  .bundle()
  .pipe(source(package.dest.main))
  .pipe(gulp.dest(package.dest.dist));
})

/**
 * Compiling resources and serving application
 */
.task('serve', ['bower', 'server'], function() {
  return gulp.watch([
    package.paths.js, package.paths.jsx, package.paths.html, package.paths.less
  ], ['copyhtml','less', 'js', browserSync.reload
  ]);
})
