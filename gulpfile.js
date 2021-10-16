const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));

// scssファイルの変更を監視しcssを生成する
gulp.task('default', () =>
  gulp.watch('app/static/scss', () =>
    gulp.src('app/static/scss/style.scss')
      .pipe(
        sass({
          outputStyle: 'expanded',
        })
        .on('error', sass.logError)
      )
      .pipe(gulp.dest('app/static/css'))
  )
);
