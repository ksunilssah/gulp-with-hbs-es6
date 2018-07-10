import gulp from 'gulp';
import webpackStream from 'webpack-stream';
import webpack from 'webpack';
import named from 'vinyl-named';
import sass from 'gulp-sass';
import concat from 'gulp-concat';
import panini from 'panini';
import {
    create as bsCreate
} from 'browser-sync';


const browserSync = bsCreate();
//Path for all the files
const paths = {
    dist: {
        dist: './dist',
        js: './dist/assets/js',
        jsLib: './dist/assets/js/libs',
        css: './dist/assets/css',
        img: './dist/assets/img'
    },
    js: ['./src/assets/js/app.js'],
    libs: ['./src/assets/js/libs/jquery-3.3.1.min.js']
}
const webpackConfig = {
    module: {
        loaders: [{
            exclude: /(node_modules)/,
            test: /.js$/,
            loader: 'babel-loader'
        }]
    }
}

//Compile sass to css
gulp.task('sass', function () {
    return gulp.src('src/assets/scss/app.scss')
        //.pipe(sass().on('error', sass.logError))
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest(paths.dist.css));
});

//Concat and compile ES6 code
gulp.task('scripts', function () {
    return gulp.src(paths.js)
        .pipe(named())
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(gulp.dest(paths.dist.js));
});

//Concat all the libs 
gulp.task("jsLibs", function () {
    return gulp.src(paths.libs)
        .pipe(concat("libs.js"))
        .pipe(gulp.dest(paths.dist.jsLib));
});


//Compile all the companents 
gulp.task('pages', function () {
    return gulp.src('src/templates/pages/**/*.{html,hbs,handlebars}')
        .pipe(panini({
            root: 'src/templates/',
            layouts: 'src/templates/layouts/',
            partials: 'src/templates/components/',
            data: 'src/templates/data/',
            helpers: 'src/templates/helpers/'
        }))
        .pipe(gulp.dest(paths.dist.dist));
});


//Copy all the images into dist folder
gulp.task('copyImages', function () {
    return gulp.src('src/assets/img/*.*')
        .pipe(gulp.dest(paths.dist.img));
});


gulp.task('serve', ['sass'], function () {
    browserSync.init({
        server: paths.dist.dist,
        port: '8082'
    });
});

// Load updated HTML templates and partials into Panini
function resetPages() {
    panini.refresh();
    browserSync.reload();
}

gulp.task('default', ['sass', 'jsLibs', 'scripts', 'pages', 'copyImages', 'serve']);

//Watch if there is any change in the files
gulp.watch(['src/**/*.scss'], ['sass']).on('change', browserSync.reload);
gulp.watch(['src/assets/js/libs/*.js'], ['jsLibs']).on('change', browserSync.reload);
gulp.watch(['src/assets/js/app.js', 'src/templates/components/**/*.js'], ['scripts']).on('change', browserSync.reload);
gulp.watch(['src/templates/**/*.{html,hbs}'], ['pages']).on('change', resetPages);
gulp.watch(['scr/assets/img'], ['copyImages']).on('change', browserSync.reload);