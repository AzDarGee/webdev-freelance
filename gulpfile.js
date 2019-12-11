// Import Gulp Plugins

var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var gzip = require('gulp-gzip');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
var jpegtran = require('imagemin-jpegtran');
var webp = require('imagemin-webp');
var pngquant = require('imagemin-pngquant');
var optiPng = require('imagemin-optipng');
var imageresize = require('gulp-image-resize');
var cache = require('gulp-cache');
var gulpUtil = require('gulp-util');
var exec = require('child_process').exec;

var gzip_options = {
    threshold: '1kb',
    gzipOptions: {
        level: 9
    }
};

// Update Node / NPM
gulp.task('updateTools', function (cb) {

  // Update Node To Latest Stable Release
  exec('sudo npm install -g n', function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      if (err) return cb(err);
  });

  exec('sudo n stable', function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      if (err) return cb(err);
  });

  // Update NPM Globally To Latest Version
  exec('sudo npm install npm@latest -g', function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      if (err) return cb(err);
  });

  // Minify + Uglify Newly Updated Packages
  exec('gulp build', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    if (err) return cb(err);
    cb(); // finished task
  });
});

// Update All NPM Packages + Uglify + Minify Plugins
// Will potentially screw up the site because vendors add/drop features and tags
gulp.task('updatePackages', function (cb) {

  // Update NPM Packages
  exec('npm update -save', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    if (err) return cb(err);
  });

  // Minify + Uglify Newly Updated Packages
  exec('gulp build', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    if (err) return cb(err);
    cb(); // finished task
  });
});

/* Compile Sass */
gulp.task('sass', function() {
  return gulp.src('components/stylesheets/**/*.scss')
      .pipe(sass().on('error', sass.logError))
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

// Uglify My JS files
gulp.task('compress', function() {
  return gulp.src('components/scripts/*.js')
    .pipe(uglify().on('error', gulpUtil.log))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gzip(gzip_options))
    .pipe(gulp.dest('dist/js'))
    //Browser sync will watch changes and reload on save
    .pipe(browserSync.stream());
});

// Uglify JS Plugins
gulp.task('uglifyPlugins', function() {
  return gulp.src(['node_modules/mdbootstrap/js/bootstrap.js',
    'node_modules/jquery/dist/jquery.js',
    'node_modules/MDBootstrap/js/mdb.js',
    'node_modules/MDBootstrap/js/popper.min.js'])
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
  return gulp.src(['node_modules/mdbootstrap/css/bootstrap.css',
    'node_modules/animate.css/animate.css',
    'node_modules/font-awesome/css/font-awesome.css',
    'node_modules/mdbootstrap/css/mdb.css'])
    .pipe(rename({
      suffix: '.min',
      extname: '.css'
    }))
    .pipe(minifycss({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css'))
    //Browser sync will watch changes and reload on save
    .pipe(browserSync.stream());
});

// Copy Fonts
gulp.task('copyFonts', async function() {
   gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg,eot,woff2,otf}')
   .pipe(gulp.dest('dist/font'))
   .pipe(browserSync.stream());
   gulp.src('./components/font/**/*.{ttf,woff,eof,svg,eot,woff2,otf}')
   .pipe(gulp.dest('dist/font'))
   .pipe(browserSync.stream());
});

//Copy MDBootstrap Imgs Folder to Dist
gulp.task('copyMDBImgs', async function() {
   gulp.src('./node_modules/mdbootstrap/img/**/*.{png,svg,gif,jpg,jpeg,}')
   .pipe(gulp.dest('dist/img'))
   .pipe(browserSync.stream());
   gulp.src('./img/**/*.{png,svg,gif,jpg,jpeg,}')
   .pipe(gulp.dest('dist/img'))
   .pipe(browserSync.stream());
});

// Build Task - Run Uglify & Minify Plugins
gulp.task('build', gulp.parallel('compress', 'sass', 'uglifyPlugins', 'minifyPlugins'));

/* Watch Files For Changes */
gulp.task('watch', async function() {

  // Define server for browser sync
  browserSync.init({
    server: {
      baseDir: "./"
    },
    port: 3030
  });

  gulp.watch('components/stylesheets/**/*.scss', gulp.series('sass'));
  gulp.watch('components/scripts/*.js', gulp.series('compress'));

  // Watch html changes and reload browser on save
  gulp.watch("*.html").on('change', browserSync.reload);

});

gulp.task('startServer', gulp.series('build', 'watch'));

gulp.task('newProject', gulp.parallel('updateTools', 'updatePackages'));

// Initialize Project Script

// NEED A DEPLOY SCRIPT


/**
 * Make sure Graphicsmagick is installed on your system
 * osx: brew install graphicsmagick
 * ubuntu: apt-get install graphicsmagick
 *
 * Install these gulp plugins
 * glup, gulp-image-resize, gulp-imagemin and imagemin-pngquant
 *
 * Group images according to their output dimensions.
 * (ex: place all portfolio images into "images/portfolio"
 * and all background images into "images/bg")
 *
 **/

// set the folder name and the relative paths
// in the example the images are in ./assets/images
// and the public directory is ../public
var paths = {
    folder: 'images/',
    src: 'components/',
    dest: 'dist/'
}

// create an array of image groups (see comments above)
// specifying the folder name, the ouput dimensions and
// whether or not to crop the images
var images = [
    { folder: 'bg', width: 1920, crop: false },
    { folder: 'bg2x', width: 2048, crop: false },
    { folder: 'original', crop: false },
    { folder: 'icons', crop: false },
    { folder: 'track-pics', width: 376, height: 376, crop: true },
    { folder: 'projects', width: 300, height: 300, crop: false },
    { folder: 'profile', width: 150, height: 150, crop: false },
    { folder: 'profile2x', width: 250, height: 400, crop: false }
];

// images gulp task
gulp.task('images', async function () {

    // loop through image groups
    images.forEach(function(type){

    	// build the resize object
        var resize_settings = {
            width: type.width,
            crop: type.crop,
            // never increase image dimensions
            upscale : false
        }
        // only specify the height if it exists
        if (type.hasOwnProperty("height")) {
            resize_settings.height = type.height
        }

        gulp

        // grab all images from the folder
        .src(paths.src+paths.folder+type.folder+'/**/*')

        // resize them according to the width/height settings
        .pipe(imageresize(resize_settings))

        // optimize the images
        // .pipe(imagemin({
        //     progressive: true,
        //     // set this if you are using svg images
        //     svgoPlugins: [{removeViewBox: false}],
        //     use: [pngquant()]
        // }))
        .pipe(imagemin([
          imagemin.gifsicle({interlaced: true}),
          imagemin.jpegtran({progressive: true}),
          imagemin.optipng({optimizationLevel: 0}),
          imagemin.svgo({
            plugins: [
              {removeViewBox: true},
              {cleanupIDs: false}
            ]
          })

        ], {
          verbose: true
        }))
        // output each image to the dest path
        // maintaining the folder structure
        .pipe(gulp.dest(paths.dest+paths.folder+type.folder));
    });
});
