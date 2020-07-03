const {src, dest, watch, series, parallel} = require('gulp');
const gulp = require('gulp');

var sass = require('gulp-sass');

sass.compiler = require('node-sass');

const
  $ = require('gulp-load-plugins')(),
  browserSync = require('browser-sync').create(),
  reload = browserSync.reload,
  minimist = require('minimist'),
  arg = minimist(process.argv.slice(2)),
  svgmin = require('gulp-svgmin'),
  svgstore = require('gulp-svgstore'),
  cheerio = require('gulp-cheerio');

// Default environment options.
var envOption = {
  minify: false,
  sourcemap: true,
  styleGuide: true
};

// Set environment options. Vagrant uses defaults.
switch (arg.env) {
  case 'production':
    envOption.minify = true;
    envOption.sourcemap = false;
    envOption.styleGuide = false;
    break;
}

// File paths
const files = {
  scssPath: './sass/**/*.scss',
  iconPath: './icons/*'
};

gulp.task('icons', function () {
  return gulp.src('./src/icons/*')
    .pipe(svgmin())
    .pipe(svgstore({ fileName: 'icons.svg', inlineSvg: true}))
    .pipe(cheerio({
      run: function ($, file) {
        $('svg').addClass('hidden');
        $('[fill]').removeAttr('fill');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(gulp.dest('./images/'));
});

gulp.task('browser-sync', function(done) {
  browserSync.init({
    proxy: 'thegalleryguide.lndo.site/',
    notify: false
  });

  browserSync.watch('./templates/**').on('change', browserSync.reload);

  browserSync.watch('./css/**').on('change', browserSync.reload);

  done()
});

gulp.task('sass-lint', function () {
  return gulp.src('sass/**/*.scss')
    .pipe($.cached($.scssLint))
    .pipe($.scssLint({
      'config': 'scss-lint.yml'
    }));
});

gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))

        .pipe($.if(envOption.sourcemap, $.sourcemaps.init()))
        .pipe($.sass())
        .pipe($.autoprefixer('last 2 versions', 'ie 8', 'ie 9'))
        // Optionally produce production CSS.
        .pipe($.if(envOption.sourcemap, $.sourcemaps.write('./')))
        .pipe($.if(envOption.minify, $.minifyCss()))
        .pipe(dest('css'))

    .pipe(gulp.dest('./css'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', gulp.series('sass', 'browser-sync', function(done) {
  gulp.watch('./sass/**/*.*', gulp.series('sass', 'sass-lint'));
  done()
}));

gulp.task('default', gulp.series('sass', 'sass-lint', 'watch'));
