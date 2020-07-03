const {src, dest, watch, series} = require('gulp');

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

function watchTask() {
  browserSync.init({
    proxy: 'thegalleryguide.lndo.site/'
  });

  watch([files.scssPath],
    {interval: 1000, usePolling: true}, //Makes docker work
    series(
      sassCompile,
      browserSync.reload
    )
  );

  watch(files.scssPath, sassCompile);
  watch('css/**/*.css').on('change', reload);
  watch('templates/**/*.twig').on('change', reload);
}

function icons() {
  return src('./src/icons/*')
    .pipe(svgmin())
    .pipe(svgstore({ fileName: 'icons.svg', inlineSvg: true}))
    .pipe(cheerio({
      run: function ($, file) {
        $('svg').addClass('hidden');
        $('[fill]').removeAttr('fill');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(dest('./images/'));
}

function sassLint() {
  return src('sass/**/*.scss')
    .pipe($.cached($.scssLint))
    .pipe($.scssLint({
      'config': 'scss-lint.yml'
    }));
}

// Use Node Sass (LibSass) to compile Sass.
function sassCompile() {
  return src('sass/gall.scss')
    .pipe($.if(envOption.sourcemap, $.sourcemaps.init()))
    .pipe($.sass())
    .pipe($.autoprefixer('last 2 versions', 'ie 8', 'ie 9'))
    // Optionally produce production CSS.
    .pipe($.if(envOption.sourcemap, $.sourcemaps.write('./')))
    .pipe($.if(envOption.minify, $.minifyCss()))
    .pipe(dest('css'));
}

exports.icons = series(
  icons
);

exports.lint = series(
  sassLint
);

exports.default = series(
  sassCompile,
  watchTask
);
