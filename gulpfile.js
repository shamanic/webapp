/**
 * gulpfile.js
 *
 * @author Kevin Hinds @ shamanic.io
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * @copyright Shamanic, http://www.shamanic.io
 */
var gulp = require('gulp');

// include plugins
var jshint = require('gulp-jshint');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var bulkSass = require('gulp-sass-bulk-import');
var cssmin = require('gulp-cssmin');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// target all SASS/AngularJS browser "build" files to minify
var angularJS = ['ui/build/angular/*.js', 'ui/build/angular/**/*.js'];
var vendorJS =  ['node_modules/angular/angular.min.js'
                 ,'node_modules/angular-route/angular-route.min.js'
                 ,'node_modules/angular-foundation/mm-foundation-tpls.min.js'
                 ,'node_modules/topojson/build/topojson.min.js'
                 ,'node_modules/fastclick/lib/fastclick.js'
                 ,'node_modules/d3/d3.min.js']
var sassSCSS = ['ui/build/scss/*.scss', 'ui/build/scss/**/*.scss'];
var vendorSCSS = ['node_modules/foundation/scss/foundation.scss', 'node_modules/foundation/scss/normalize.scss'];


// compile our own SASS with the include paths passed in for all the @imports
gulp.task('sass', function() {
    return gulp.src(sassSCSS)
    	.pipe(sourcemaps.init())
        .pipe(bulkSass())
        .pipe(sass({
            outputStyle: 'compressed'
         }).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(cssmin())
        .pipe(gulp.dest('ui/css'));
});

// compile our vendor SCSS with the include paths passed in for all the @imports
gulp.task('vendor-sass', function() {
    return gulp.src(vendorSCSS)
    	.pipe(sourcemaps.init())
        .pipe(bulkSass())
        .pipe(sass({
            outputStyle: 'compressed'
         }).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(cssmin())
        .pipe(gulp.dest('ui/css/vendor'));
});

// concatenate & minify js (no mangling, mangle breaks angularJS)
gulp.task('angular', function() {
    return gulp.src(angularJS)
        .pipe(concat('app.js'))
        .pipe(gulp.dest('ui/js'))
        .pipe(rename('app.min.js'))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('ui/js'));
});

// concatenate & minify js (no mangling, mangle breaks angularJS)
gulp.task('vendor-js', function() {
    return gulp.src(vendorJS)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('ui/js'))
        .pipe(rename('vendor.min.js'))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('ui/js'));
});

// lint task
gulp.task('lint', function() {
    return gulp.src(angularJS)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// build a new version of the site with all dependancies included to the 'build' folder
gulp.task('build', ['lint','sass','angular', 'vendor-sass', 'vendor-js']);

// the default gulp job which will create a 'build' of the site as well as initiating the file system watchers to continue your development
gulp.task('default', ['build', 'watch']);

// continue to watch files for changes during your development
gulp.task('watch', function() {
    gulp.watch(angularJS, ['lint', 'angular']);
    gulp.watch(vendorJS, ['vendor-js']);
    gulp.watch(sassSCSS, ['sass']);
    gulp.watch(vendorSCSS, ['vendor-sass']);
});
