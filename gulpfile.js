'use strict';

// Gulp requires.
var gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  browserSync = require('browser-sync').create(),
  reload = browserSync.reload,
  spritesmith = require('gulp.spritesmith'),
  minimist = require('minimist'),
  arg = minimist(process.argv.slice(2));

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

// BrowserSync.
gulp.task('browsersync', function () {
  browserSync.init({
    proxy: 'drupalvm.dev'
  });
  gulp.watch('css/**/*.css').on('change', reload);
  gulp.watch('templates/**/*.twig').on('change', reload);
});

// Use Node Sass (LibSass) to compile Sass.
gulp.task('sass', function () {
  gulp.src('sass/gall.scss')
    .pipe($.if(envOption.sourcemap, $.sourcemaps.init()))
    .pipe($.sass())
    .pipe($.autoprefixer('last 2 versions', 'ie 8', 'ie 9'))
    // Optionally produce production CSS.
    .pipe($.if(envOption.sourcemap, $.sourcemaps.write('./')))
    .pipe($.if(envOption.minify, $.minifyCss()))
    .pipe(gulp.dest('css'));
});

// SCSS lint.
gulp.task('scss-lint', function () {
  gulp.src('sass/**/*.scss')
    .pipe($.cached($.scssLint))
    .pipe($.scssLint({
      'config': 'scss-lint.yml'
    }));
});

// Spritesmith.
gulp.task('sprite', function() {
  var spriteData = gulp.src('images/src/*.png')
    .pipe(spritesmith({
      imgPath: '../images/sprite.png',
      imgName: 'sprite.png',
      cssName: '_sprites.scss'
    }));
  spriteData.img.pipe(gulp.dest('images'));
  spriteData.css.pipe(gulp.dest('sass/base'));
});

// Default - initial compile and watch.
gulp.task('default', ['sprite', 'sass', 'watch', 'browsersync'], function () {
});

// Watch Sass - compile to CSS.
gulp.task('watch', function () {
  gulp.watch('sass/**/*.scss', ['sprite', 'sass']);
});

// Run BrowserSync.
gulp.task('sync', ['sass', 'watch', 'browsersync'], function () {
});

// Initial build.
gulp.task('build', ['sass', 'hologram'], function () {
});