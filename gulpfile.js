'use strict';

const gulp         = require('gulp'),
			sass         = require('gulp-sass'),
			plumber      = require('gulp-plumber'),
			postcss      = require('gulp-postcss'),
			autoprefixer = require('autoprefixer'),
			stripCss     = require('gulp-strip-css-comments'),
			strip        = require('gulp-strip-comments'),
			uglifyCss    = require('gulp-uglifycss'),
			uglify       = require('gulp-uglify'),
			imagemin     = require('gulp-imagemin'),
			imgCompress  = require('imagemin-jpeg-recompress'),
			responsive   = require('gulp-responsive'),
			webp         = require('gulp-webp'),
			newer        = require('gulp-newer'),
			bwsync       = require('browser-sync').create();

const path = {
						build: {
							html:   'dev/',
							css:    'dev/css/',
							srccss: 'src/css/',
							js:     'dev/js/',
							img:    'dev/img/',
							imgx:   'dev/img/x3/',
							font:   'src/font/'
						},
						src: {
							html: 'src/**/*.html',
							css:  'src/scss/style.scss',
							js:  ['src/js/*.js',],
							img: ['src/img/**/*.jpg',
										'src/img/**/*.svg',
										'src/img/**/*.png'],
							font: 'src/font/**/*.*'
						},
						watch: {
							dev: 'src',
							html: 'src/**/*.html',
							css:  'src/scss/*.scss',
							js:   'src/js/*.js',
							img: ['src/img/**/*.jpg',
										'src/img/**/*.svg',
										'src/img/**/*.png'],
							font: 'src/font/**/*.*'
						},
					};

gulp.task('serv', function() {
	bwsync.init({
		server: {
			baseDir: './src',
			notify: false,
		}
	});
	bwsync.watch(path.watch.dest, bwsync.reload);
});

gulp.task('html', function() {
	return gulp.src(path.src.html)
		.pipe(plumber())
		.pipe(gulp.dest(path.build.html))
		.pipe(bwsync.stream());
});

gulp.task('font', function() {
	return gulp.src(path.src.font)
		.pipe(plumber())
		.pipe(newer(path.build.font))
		.pipe(gulp.dest(path.build.font))
		.pipe(bwsync.stream());
});

gulp.task('style', function() {
	return gulp.src(path.src.css)
		.pipe(plumber())
		.pipe(sass())
		.pipe(postcss([
			autoprefixer({
				overrideBrowserslist: ['last 10 versions']
			})
		]))
		.pipe(gulp.dest(path.build.srccss))
		.pipe(bwsync.stream())
		.pipe(stripCss())
		.pipe(uglifyCss())
		.pipe(gulp.dest(path.build.css));
});

gulp.task('js', function () {
	return gulp.src(path.src.js)
		.pipe(plumber())
		.pipe(strip())
		.pipe(uglify())
		.pipe(gulp.dest(path.build.js));
});

gulp.task('img', function() {
	return gulp.src(path.src.img)
		.pipe(plumber())
		.pipe(newer(path.build.imgx))
		.pipe(imagemin([
			imgCompress({
				progressive: true,
				min: 70,
				max: 90,
				quality: 'high'
			}),
			imagemin.svgo({
				plugins: [
				{removeViewBox: true},
				{cleanupIDs: false}
				]
			})
		]))
		.pipe(gulp.dest(path.build.imgx))
		.pipe(webp({quality: 70}))
		.pipe(gulp.dest(path.build.imgx));
});

gulp.task('imgx', function() {
	return gulp.src(path.src.img)
		.pipe(plumber())
		.pipe(newer(path.build.img))
		.pipe(responsive({
			'*': [{
				width: '50%',
				quality: 90,
				rename: { prefix: 'x2/', },
				}, {
				width: '33%',
				quality: 90,
				rename: { prefix: 'x1/', },
			}]
		}))
		.pipe(gulp.dest(path.build.img));
});

gulp.task('watch', function() {
	gulp.watch(path.watch.html, gulp.series('html'));
	gulp.watch(path.watch.css, gulp.series('style'));
	gulp.watch(path.watch.js, gulp.series('js'));
	gulp.watch(path.watch.font, gulp.series('font'));
	gulp.watch(path.watch.img, gulp.series(
		gulp.parallel('img', 'imgx')
		));
});


gulp.task('default', gulp.series(
	gulp.parallel('watch', 'serv')
));
