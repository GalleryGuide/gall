const { src, dest, watch, series } = require("gulp");
const plumber = require("gulp-plumber");
const $ = require("gulp-load-plugins")();
const sass = require("gulp-sass")(require("sass"));
const bs = require("browser-sync").create();

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

/**
 * Initialise browser-sync to proxy the site.
 */
const browserSyncServe = () => {
  buildStyles();
  bs.init({
    // Dev server will run at localhost:8080
    proxy: "localhost",
    port: 8080
  });
};

/**
 * Trigger a reload via browser-sync.
 *
 * @param callback The callback function.
 */
const browsersyncReload = (callback) => {
  bs.reload();
  callback();
};

/**
 * Watch Sass files and build when they change.
 */
const watchFiles = () => {
  browserSyncServe();
  watch(
    ["scss/**/*.scss"],
    { events: "all", ignoreInitial: false },
    series(buildStyles, browsersyncReload)
  );
};

exports.styles = series(buildStyles);
exports.build = series(icons, buildStyles);
exports.watch = watchFiles;
exports.serve = browserSyncServe;
