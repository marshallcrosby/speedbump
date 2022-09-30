/// <binding ProjectOpened='build' />
'use strict';

const gulp = require('gulp');

// HTML-related
const beautifyCode = require('gulp-beautify-code');
const twig = require('gulp-twig');

// CSS-related
const sass = require('gulp-dart-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cleanCss = require('gulp-clean-css');

// JS-related
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const include = require('gulp-include');

// Utility-related
const sourcemaps = require('gulp-sourcemaps');
const connect = require('gulp-connect');
const open = require('gulp-open');

const localhost = 'http://127.0.0.1:8080/';

const roots = {
    src: './src',
    dist: './dist',
};

// Move html to dist
gulp.task('html', function (done) {
    gulp.src([`${roots.src}/**/*.html`])
        .pipe(gulp.dest(`${roots.dist}`))
        .pipe(connect.reload());
    done();
});

// Creates JS sourcemaps, concatenates JS files into one file based on array above, and minifies JS
gulp.task('js', function (done) {
    gulp.src([`${roots.src}/assets/js/speedbump.js`], { sourcemaps: true })
        .pipe(include())
        .pipe(concat('speedbump.js'))
        .pipe(minify({ ext: { min: ".min.js" }}))
        .pipe(gulp.dest(`${roots.dist}/assets/js`, { sourcemaps: '.' }))
        .pipe(connect.reload());
    done();
});

// Creates Main CSS sourcemaps, converts SCSS to CSS, adds prefixes, and lints CSS
gulp.task('sass', function (done) {
    const plugins = [
        autoprefixer({ grid: true })
    ];

    gulp.src([`${roots.src}/assets/scss/speedbump.scss`])
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(cleanCss({compatibility: 'ie11'}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(`${roots.dist}/assets/css`))
        .pipe(connect.reload());
    done();
});

// Runs a server to static HTML files and sets up watch tasks
gulp.task('server', function (done) {
    gulp.watch((`${roots.src}/**/*.html`), gulp.series('html'));
    gulp.watch((`${roots.src}/assets/scss/**/*.scss`), gulp.series('sass'));
    gulp.watch((`${roots.src}/assets/js/**/*`), gulp.series('js'));

    connect.server({
        root: roots.dist,
        livereload: true
    });

    setTimeout(function () {
        gulp.src(__filename)
            .pipe(open({ uri: localhost }));
    }, 2000);

    done();
});

gulp.task('build', gulp.series('js', 'sass', 'html'));

gulp.task('default', gulp.series('build', 'server'));
