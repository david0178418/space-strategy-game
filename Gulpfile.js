var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var webserver = require('gulp-webserver');

gulp.task('watch', function() {
	gulp.watch('./src/**/*.js', ['browserify']);
});

gulp.task('browserify', function(){
    return browserify({
            entries: ['./main.js'],
            debug: true,
            insertGlobals: true,
            paths: [
                'src',
                'libs',
            ]
        })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('webserver', function() {
	gulp.src('./')
		.pipe(webserver({
			open: false,
			port: '8080',
		}));
});

gulp.task('default',['browserify', 'webserver', 'watch']);
