// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'production';
process.noDeprecation = true;

var chalk = require('chalk');
var webpack = require('webpack');
var config = require('../config/webpack.config.prod');

build();

function build() {
  console.log('Creating an optimized production build for inferno apps...');
  webpack(config).run((err, stats) => {
    if (err) {
      printErrors('Failed to compile.', [err]);
      process.exit(1);
    }

    if (stats.compilation.errors.length) {
      printErrors('Failed to compile.', stats.compilation.errors);
      process.exit(1);
    }

    if (process.env.CI && stats.compilation.warnings.length) {
     printErrors('Failed to compile.', stats.compilation.warnings);
     process.exit(1);
   }

    console.log(stats.toString({ chunks: false, colors: true }));

    console.log(chalk.green('Compiled successfully.'));
    console.log();
  });
};

function printErrors(summary, errors) {
  console.log(chalk.red(summary));
  console.log();
  errors.forEach(err => {
    console.log(err.message || err);
    console.log();
  });
}