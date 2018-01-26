process.env.NODE_ENV = 'production';
const chalk = require('chalk');
const path = require('path');
const buildJSXView = require('express-engine-inferno-jsx/build');
// source path for JSX views
const devViewPath = path.join(__dirname, '../views');
// destination path for JS views
const productionViewPath = path.join(__dirname, '../views/cache');

buildJSX();

function buildJSX() {
  console.log('Building JSX Views for production...');
  buildJSXView(devViewPath, productionViewPath, (err)=> {
    if (err) {
      printErrors('Build JSX Error', [err]);
      process.exit(1);
    }
    console.log(chalk.green('JSX Views Compiled Successfully.'));
    console.log();
  })
}

function printErrors(summary, errors) {
  console.log(chalk.red(summary));
  console.log();
  errors.forEach(err => {
    console.log(err.message || err);
    console.log();
  });
}
