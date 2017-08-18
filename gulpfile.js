var gulp = require('gulp'),
		browserSync = require('browser-sync'),
		autoprefixer = require('gulp-autoprefixer'),
		pug = require('gulp-pug'),
		cssnano = require('gulp-cssnano'),
		imagemin = require('gulp-imagemin'),
		sass = require('gulp-sass'),
		plumber = require('gulp-plumber'),
		errorHandler = require('gulp-plumber-error-handler'),
		watch = require('gulp-watch');

gulp.task('pug', function buildHTML() {
	return gulp.src('app/templates/pages/*.pug')
		.pipe(plumber({errorHandler: errorHandler(`Error in \'templates\' task`)}))
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest('dist'))
});

gulp.task('sass', function () {
	return gulp.src('app/sass/main.sass')
	.pipe(plumber())
	.pipe(sass({
		errLogToConsole: true,
	}))
	.pipe(gulp.dest('dist/css'));
});

gulp.task('css', () =>
	gulp.src('app/css/*.css')
		.pipe(gulp.dest('dist/css'))
);

gulp.task('img-min', () =>
	gulp.src('app/img/**/*')
		.pipe(imagemin([
			imagemin.gifsicle({ interlaced: true }),
			imagemin.jpegtran({ progressive: true }),
			imagemin.optipng({ optimizationLevel: 15 }),
			imagemin.svgo({ plugins: [{ removeViewBox: true }] })
		]))
		.pipe(gulp.dest('dist/img'))
);

gulp.task('browser-sync', function () {
	browserSync({
		server: {
			baseDir: 'dist'
		},
		port: 8080,
		open: true,
		notify: true
	});
});

gulp.task('build-css', () =>
	gulp.src('app/css/*.css')
		.pipe(autoprefixer({
			browsers: ['last 8 versions'],
			cascade: true
		}))
		.pipe(cssnano())
		.pipe(gulp.dest('dist/css'))
);

gulp.task('js', function() {  
	return gulp.src('app/js/*.js')
			.pipe(gulp.dest('dist/js'))
});

gulp.task('default', ['browser-sync'], function () {
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch('app/templates/pages/*.pug', ['pug']);
	gulp.watch('app/js/*.js', ['js']);
	gulp.watch('dist/css/**/*.css', browserSync.reload);
	gulp.watch('dist/*.html', browserSync.reload);
	gulp.watch('dist/js/*.js', browserSync.reload);
});