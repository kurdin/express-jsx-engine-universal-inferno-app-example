'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var nodemon = require('gulp-nodemon');
var WebpackDevServer = require('webpack-dev-server');
var openBrowser = require('inferno-dev-utils/openBrowser');
var run = require('gulp-run');

gulp.task('default', ['inferno']);
gulp.task('build', ['jsx-views:build', 'inferno:build']);
gulp.task('inferno', ['nodemon-webpack-server', 'inferno-webpack-server']);

gulp.task('inferno-webpack-server', function(callback) {
	var runWebPackInfernoServer = require('./apps-inferno/scripts/start');
	runWebPackInfernoServer(8080, function() {
		setTimeout(() => {
			openBrowser('http://localhost:8080/');
		}, 2000);
		callback();
	});
});

gulp.task('nodemon-webpack-server', function(cb) {
	var started = false;
	nodemon({
		script: 'index.js',
		watch: ['index.js', 'controllers', 'routes', 'models', 'lib'],

		// ignore: [
		//          'apps/src',
		//          'node_modules'
		//      ],
		
		env: {
			NODE_ENV: 'development'
		},
		ext: 'html dust js'
	})
		.on('change')
		.on('start', function() {
			if (!started) {
				cb();
				started = true;
			}
		});
});

gulp.task('inferno:build', function() {
	require('./apps-inferno/scripts/build');
});

gulp.task('jsx-views:build', function() {
	require('./lib/build-jsx-views')
});