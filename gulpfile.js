var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var gzip = require('gulp-gzip');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();

var gzip_options = {
    threshold: '1kb',
    gzipOptions: {
        level: 9
    }
};

/* Compile Our Sass */
gulp.task('sass', function() {
  return gulp.src('components/stylesheets/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('css'))
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(minifycss())
      .pipe(gulp.dest('dist/css'))
      .pipe(gzip(gzip_options))
      .pipe(gulp.dest('dist/css'))
      //Browser sync will watch changes and reload on save
      .pipe(browserSync.stream());
});

// Uglify JS
gulp.task('compress', function() {
  return gulp.src('components/scripts/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gzip(gzip_options))
    .pipe(gulp.dest('dist/js'))
    //Browser sync will watch changes and reload on save
    .pipe(browserSync.stream());
});

// Uglify Plugins
gulp.task('uglifyPlugins', function() {
  return gulp.src(['components/libs/bootstrap/dist/js/bootstrap.js',
    'components/libs/jquery/dist/jquery.js'])
    .pipe(rename({
      suffix: '.min',
      extname: '.js'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    //Browser sync will watch changes and reload on save
    .pipe(browserSync.stream());
});

// Minify Plugins
gulp.task('minifyPlugins', function() {
  return gulp.src(['components/libs/bootstrap/dist/css/bootstrap.css'])
    .pipe(rename({
      suffix: '.min',
      extname: '.css'
    }))
    .pipe(minifycss({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css'))
    //Browser sync will watch changes and reload on save
    .pipe(browserSync.stream());
});

// Build Task - Run Uglify & Minify Plugins
gulp.task('build', ['uglifyPlugins', 'minifyPlugins']);

/* Watch Files For Changes */
gulp.task('watch', function() {

  // Define server for browser sync
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });

  gulp.watch('components/stylesheets/**/*.scss', ['sass']);
  gulp.watch('components/scripts/*.js', ['compress']);

  // Watch html changes and reload browser on save
  gulp.watch("*.html").on('change', browserSync.reload);

});

gulp.task('default', ['sass', 'compress', 'uglifyPlugins', 'minifyPlugins', 'watch']);
