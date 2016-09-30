var gulp = require('gulp');

gulp.task('html', function () {
    gulp.src('index.html')
        .pipe(gulp.dest('dist'));
    gulp.src('./symlinks/*.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('deploy', ['html']);
