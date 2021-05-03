import { src, dest, watch, series, parallel } from "gulp";
import postcss from "gulp-postcss";
import sourcemaps from "gulp-sourcemaps";
import autoprefixer from "autoprefixer";
import yargs from "yargs";
import sass from "gulp-sass";
import cleanCss from "gulp-clean-css";
import gulpif from "gulp-if";
import imagemin from "gulp-imagemin";
import del from "del";
import fileinclude from "gulp-file-include";
import include from "gulp-include";
import webpack from "webpack-stream";
import named from "vinyl-named";
import replace from "gulp-replace";
import browserSync from "browser-sync";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
// import iconsFont from "./icons.font";
import info from "./package.json";

const PRODUCTION = yargs.argv.prod;

// browserSync
export const sync = () => {
  browserSync.init({
    server: {
      baseDir: "./build",
    },
    open: false,
  });
};

// Reload on watch().done
export const reload = (done) => {
  browserSync.reload();
  return done();
};

// Styles task
export const styles = () => {
  return (
    src([
      "src/scss/app.scss",
      "src/scss/bootstrap.min.scss",
      "src/scss/bootstrap_select.min.scss",
    ]) //@TODO: make the files different tasks
      //  return src(['src/scss/app.scss'])
      .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
      .pipe(sass().on("error", sass.logError))
      .pipe(gulpif(PRODUCTION, postcss([autoprefixer])))
      .pipe(gulpif(PRODUCTION, cleanCss({ compatibility: "ie8" })))
      .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
      .pipe(dest("./build/css"))
      .pipe(browserSync.stream())
  );
};

// Images task
export const images = () => {
  return src(["src/images/**/*.{jpg,jpeg,png,svg,gif,webmanifest}"])
    .pipe(gulpif(PRODUCTION, imagemin()))
    .pipe(dest("./build/images"));
};

// Watch task
export const watchForChanges = () => {
  watch("src/scss/**/*.scss", styles);
  watch("src/images/**/*.{jpg,jpeg,png,svg,gif}", images);
  watch(
    ["src/**/*", "!src/{images,js,scss}", "!src/{images,js,scss}/**/*"],
    copy
  );
  watch("src/js/**/*.js", scripts);
  watch(["./src/**/*.html"], fileInclude);
};

// Copy task
export const copy = () => {
  return src([
    "src/**/*",
    "!src/{images,js,scss,parts}",
    "!src/{images,js,scss,parts}/**/*",
    "!src/*.html",
  ]).pipe(dest("./build"));
};

// Include libs js files
export const includeJs = () => {
  return src([
    "src/js/bootstrap_select.min.js",
    "src/js/jquery-3.5.1.min.js",
    "src/js/bootstrap.min.js",
    "src/js/popper.js",
  ])
    .pipe(include())
    .on("error", console.log)
    .pipe(dest("./build/js"));
};

// Include libs styles files
// export const includeCss = () => {
//     return src(['src/scss/owl.theme.default.min.css', 'src/scss/owl.carousel.min.css'])
//         .pipe(include())
//         .on('error', console.log)
//         .pipe(dest('./build/css'));
// }

// Clean task
export const clean = () => del(["assets"]);

// Scripts task
export const scripts = () => {
  return src(["src/js/app.js"])
    .pipe(named())
    .pipe(
      webpack({
        module: {
          rules: [
            {
              test: /\.js$/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: [],
                },
              },
            },
          ],
        },
        mode: PRODUCTION ? "production" : "development",
        devtool: !PRODUCTION ? "inline-source-map" : false,
        output: {
          filename: "[name].js",
        },
      })
    )
    .pipe(dest("./build/js"))
    .pipe(browserSync.stream());
};

// Production task
export const production = () => {
  return;
};

// Include html files task
export const fileInclude = () => {
  return src(["./src/*.html"])
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "./",
      })
    )
    .pipe(dest("./build"))
    .pipe(browserSync.stream());
};

// Gulp tasks bundles
export const includeLib = parallel(includeJs); // include libs files , includeCss

export const _watch = series(
  clean,
  includeLib,
  parallel(fileInclude, styles, images, copy, scripts, sync, watchForChanges)
);
export const dev = series(
  clean,
  includeLib,
  parallel(fileInclude, styles, images, copy, scripts, sync)
);
export const build = series(
  clean,
  parallel(styles, includeJs, images, copy, scripts),
  production
);

// Define gulp default task
export default dev;
