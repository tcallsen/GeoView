var gulp       = require('gulp');
var gutil = require('gulp-util');

gulp.task('watch', function() {

	gulp.watch('./src/js/**', ['cordova']);
	gulp.watch('./src/img/**', ['cordova']);
	gulp.watch('./src/css/**', ['cordova']);
	gulp.watch('./src/index.html', ['cordova']);

    // TODO probably need to start an emulator like Ripple or something ?
    var onJsChange = function(file) {
        gutil.log("WWW change detected:",file.path);
    };
    gulp.watch(['./www/**']).on('change', onJsChange);

});
