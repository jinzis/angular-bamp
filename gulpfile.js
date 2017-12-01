'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var Server = require('karma').Server;

/**
 * Run a webserver (with LiveReload)
 */
gulp.task('server', function() {
    plugins.connect.server({
        root: '.',
        fallback: './index.html',
        port: 8080,
        livereload: true
    });
    gulp.watch('./index.html',['html']);
});

/**
 * Keep multiple browsers & devices in sync when building websites.
 */
gulp.task('browser-sync', function() {

    browserSync.init({
        server: {
            baseDir: "."
        }
    });

});

gulp.task('html', function () {
    gulp.src('./index.html')
      .pipe(plugins.connect.reload());
});

/**
 * Watching file change & rebuild
 */
gulp.task('watch', function () {
    gulp.watch('src/**/**/*.scss').on('change', browserSync.reload);
    gulp.watch('./index.html').on('change', browserSync.reload);
});

/**
 * build Tasks
 */
gulp.task('build', function () {

    // cleanup previous builds
    gulp.src('dist/js/*.js', {read: false})
        .pipe(plugins.clean());

    // build js
    gulp.src(['src/service/*.js'])
        .pipe(plugins.removeUseStrict())
        .pipe(plugins.concat('angular-bmap.js'))//合并
        .pipe(gulp.dest('dist/js'))
        .pipe(plugins.rename({ suffix: '.min'}))
        .pipe(plugins.uglify({ mangle: true}))
        .pipe(plugins.size({ showFiles: true }))
        .pipe(gulp.dest('dist/js'))

});
//编译
gulp.task('style', function() {
    gulp.src('dist/style/*', {read: false})
    .pipe(plugins.clean());

    gulp.src('src/scss/*.scss')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass())
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest('dist/style'))
})

//合并压缩文件
gulp.task('scripts',function(){
    //读取CSS文件，合并，输出到新目录，重新命名，压缩，输出
    gulp.src('dist/style/*.css')
    .pipe(plugins.concat('style.css'))
    .pipe(gulp.dest('dist/style'))
    .pipe(plugins.rename('style.min.css'))
    .pipe(plugins.minifyCss())
    .pipe(gulp.dest('dist/style'));
});


/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

/**
 * developing: rebuild after coding
 */
gulp.task('default', [ 'style','browser-sync', 'watch']);

/**
 * publish: build then bump version
 */
gulp.task('publish', ['build', 'scripts']);

