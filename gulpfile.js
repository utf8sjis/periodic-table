const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const replace = require('gulp-replace');


// scssファイルの変更を監視しcssファイルを生成する
const compileSass = () =>
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
      .pipe(gulp.dest('app/static/css/')));


// cssファイルを圧縮する
const minifyCss = () =>
  gulp.src('app/static/css/style.css')
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min',
    }))
    .pipe(gulp.dest('dist/static/css/'));


// htmlファイル内のパスを置換
const replacePath = () =>
  gulp.src('app/*.html')
    .pipe(replace('static/css/style.css', 'static/css/style.min.css'))
    .pipe(gulp.dest('dist/'));


// ファイルのdistへのコピー
const copyToDist = () =>
  gulp.src([
    'app/**',
    '!app/static/scss/**',
    '!app/static/css/**',
    '!app/*.html',
  ], {
    base: 'app/',
  })
    .pipe(gulp.dest('dist/'));


exports.default = compileSass;
exports.build = gulp.series(minifyCss, replacePath, copyToDist);
