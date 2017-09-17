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
var pngquant = require('imagemin-pngquant');
var imageresize = require('gulp-image-resize');
var cache = require('gulp-cache');
var gulpUtil = require('gulp-util');
var Twitter = require('twitter');
var exec = require('child_process').exec;

var gzip_options = {
    threshold: '1kb',
    gzipOptions: {
        level: 9
    }
};

// Update All Bower/NPM Packages + Uglify + Minify Plugins
// Will potentially screw up the site because vendors add/drop features and tags
gulp.task('updatePackages', function (cb) {
  // Update Bower Packages
  exec('bower-update --non-interactive', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    if (err) cb(err);
  });

  // Update NPM Packages
  exec('npm update', function (err, stdout, stderr) {
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

/* Compile Our Sass */
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

// Uglify JS
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

// Uglify Plugins
gulp.task('uglifyPlugins', function() {
  return gulp.src(['components/libs/bootstrap/dist/js/bootstrap.js',
    'components/libs/jquery/dist/jquery.js',
    'components/libs/MDBootstrap/js/mdb.js',
    'components/libs/MDBootstrap/js/tether.js'])
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
  return gulp.src(['components/libs/bootstrap/dist/css/bootstrap.css',
    'components/libs/animate.css/animate.css',
    'components/libs/font-awesome/css/font-awesome.css',
    'components/libs/MDBootstrap/css/mdb.css'])
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

gulp.task('default', ['sass', 'compress', 'uglifyPlugins', 'minifyPlugins', 'images', 'watch']);

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
    { folder: 'projects', width: 300, height: 300, crop: false },
    { folder: 'profile', width: 150, height: 150, crop: false },
    { folder: 'profile2x', width: 250, height: 400, crop: false }
];

// images gulp task
gulp.task('images', function () {

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
        .pipe(imagemin({
            progressive: true,
            // set this if you are using svg images
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))

        // output each image to the dest path
        // maintaining the folder structure
        .pipe(gulp.dest(paths.dest+paths.folder+type.folder));
    });
});


/* twitter */
gulp.task('twitter', function() {

  var client = new Twitter({
    consumer_key: 'Z9pVJo9jic4EC9kHnprVQsjAs',
    consumer_secret: 'JM1aGjuKOikz8XHtIs72b85qdaf2jzmtTNT02n9RWmDlWME3Ad',
    access_token_key: '2238399828-peO2Qpt2K3oTV0P1UeUQggQvVDhY7aEXP5IfRVD',
    access_token_secret: '2UFPVGnOiEthmt2flhW82SAJR9nQ562DLrC1EIUxjL2lS'
  });

  var params = {screen_name: 'ashdarji'};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      // console.log(tweets);
    }
  });

});
