var gulp = require('gulp');

gulp.task('fonts', function () {

    return gulp.src(['./src/font/**/*']).pipe(gulp.dest('./www/font'));

});