const { src, dest, watch, series } = require("gulp");
const plumber = require("gulp-plumber");
const $ = require("gulp-load-plugins")();
const sass = require("gulp-sass")(require("sass"));

/**
 * Compile Sass to CSS.
 *
 * @return {*} A stream.
 */
const buildStyles = () =>
  src("sass/gall.scss")
    .pipe(plumber())
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(dest("css/"));

const icons = () =>
  src("icons/*.svg")
    .pipe($.svgmin())
    .pipe($.svgstore({ fileName: 'icons.svg', inlineSvg: true }))
    .pipe($.cheerio({
      run: function ($, file) {
        $('svg').addClass('hidden');
        $('[fill]').removeAttr('fill');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(dest('./images/'));;

exports.icons = icons;
exports.styles = series(buildStyles);
exports.build = series(icons, buildStyles);
