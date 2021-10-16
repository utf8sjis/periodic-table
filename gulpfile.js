const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');

// scssファイルの変更を監視しcssを生成する
gulp.task('default', () =>
  gulp.watch('app/static/scss/*.scss', () =>
    gulp.src('app/static/scss/style.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({
        outputStyle: 'expanded',
      }).on('error', sass.logError))
      .pipe(autoprefixer({
        browsers: ['last 2 versions'],
      }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('dist/static/css/'))
      .pipe(cleanCSS())
      .pipe(rename({
        suffix: '.min',
      }))
      .pipe(gulp.dest('dist/static/css/'))
  )
);

// ファイルのdistへのコピー
gulp.task('copy', () => {
  gulp.src([
    'app/**',
    '!app/static/scss/**',
  ], {
    base: 'app/',
  })
    .pipe(gulp.dest('dist/'))
});
