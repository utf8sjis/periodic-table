const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const del = require('del');


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


// dist以下のファイルを削除する
const clean = () => del('dist/*');


// cssファイルを圧縮する
const minifyCss = () =>
  gulp.src('app/static/css/style.css')
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min',
    }))
    .pipe(gulp.dest('dist/static/css/'));


// jsファイルを結合、圧縮する
const minifyJs = () =>
  gulp.src([
    'app/static/js/bodyScrollLock.js',
    'app/static/js/check_browser.js',
    'app/static/js/lang_list.js',
    'app/static/js/cell_list.js',
    'app/static/js/element_list.js',
    'app/static/js/category_list.js',
    'app/static/js/group_period_list.js',
    'app/static/js/nav_link_list.js',
    'app/static/js/theme_color_list.js',
    'app/static/js/changer_title_list.js',
    'app/static/js/main.js',
  ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/static/js/'));


// htmlファイル内のパスを置換し圧縮する
const minifyHtml = () =>
  gulp.src('app/*.html')
    .pipe(replace('static/css/style.css', 'static/css/style.min.css'))
    .pipe(replace(
      /<script src=\"static\/js\/bodyScrollLock\.js\"><\/script>.+<script src=\"static\/js\/main\.js\"><\/script>/s,
      '<script src="static/js/main.min.js"></script>'))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
    }))
    .pipe(gulp.dest('dist/'));


// ファイルのdistへのコピー
const copyToDist = () =>
  gulp.src([
    'app/**',
    '!app/static/scss/**',
    '!app/static/css/**',
    '!app/static/js/**',
    '!app/*.html',
  ], {
    base: 'app/',
  })
    .pipe(gulp.dest('dist/'));


exports.default = compileSass;
exports.build = gulp.series(clean, minifyCss, minifyJs, minifyHtml, copyToDist);
