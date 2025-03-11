const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');

// **1. Компіляція SCSS у CSS + додавання префіксів**
function scss() {
    return src('assets/scss/style.scss', { sourcemaps: true }) 
        .pipe(sass().on('error', sass.logError)) 
        .pipe(postcss([autoprefixer()]))
        .pipe(dest('assets/css', { sourcemaps: '.' })) 
        .pipe(browserSync.stream());
}

// **2. Мінімізація CSS**
function minifyCss() {
    return src('assets/css/style.css')
        .pipe(postcss([cssnano()])) 
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('assets/css'));
}

// **3. Запуск локального сервера + автоматичне оновлення**
function syncInit() {
    browserSync.init({
        server: { baseDir: './' } 
    });
}

// **4. Стеження за файлами + автоматичне оновлення**
function watchFiles() {
    watch('assets/scss/**/*.scss', scss);
    watch('./*.html').on('change', browserSync.reload); 
    watch('assets/css/style.css', minifyCss); 
}

// **Запуск завдань**
exports.scss = scss;
exports.minify = minifyCss;
exports.watch = series(scss, minifyCss, parallel(syncInit, watchFiles));
