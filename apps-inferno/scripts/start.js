process.env.NODE_ENV = 'development';

// Load environment variables from .env file. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv
// require('dotenv').config({ silent: true });

var chalk = require('chalk');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
// var historyApiFallback = require('connect-history-api-fallback');
// var detect = require('detect-port');
var formatWebpackMessages = require('./formatWebpackMessages');
// var getProcessForPort = require('inferno-dev-utils/getProcessForPort');
var openBrowser = require('inferno-dev-utils/openBrowser');
// var fs = require('fs');
var config = require('../config/webpack.config.dev');
var paths = require('../config/paths');

// var useYarn = fs.existsSync(paths.yarnLockFile);
// var cli = useYarn ? 'yarn' : 'npm';
var isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
// if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
//   process.exit(1);
// }

// Tools like Cloud9 rely on this.
// var DEFAULT_PORT = process.env.PORT || 8080;
var compiler;
var handleCompile;

// You can safely remove this after ejecting.
// We only use this block for testing of Create Inferno App itself:
var isSmokeTest = process.argv.some(arg => arg.indexOf('--smoke-test') > -1);
if (isSmokeTest) {
  handleCompile = function(err, stats) {
    if (err || stats.hasErrors() || stats.hasWarnings()) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  };
}

function setupCompiler(host, port, protocol) {
  // "Compiler" is a low-level interface to Webpack.
  // It lets us listen to some events and provide our own custom messages.
  compiler = webpack(config, handleCompile);

  // "invalid" event fires when you have changed a file, and Webpack is
  // recompiling a bundle. WebpackDevServer takes care to pause serving the
  // bundle, so if you refresh, it'll wait instead of serving the old one.
  // "invalid" is short for "bundle invalidated", it doesn't imply any errors.
  compiler.plugin('invalid', function() {
    if (isInteractive) {
      // clearConsole();
    }
    console.log('Compiling...');
  });

  var isFirstCompile = true;

  // "done" event fires when Webpack has finished recompiling the bundle.
  // Whether or not you have warnings or errors, you will get this event.
  compiler.plugin('done', function(stats) {
    if (isInteractive) {
      // clearConsole();
    }

    // We have switched off the default Webpack output in WebpackDevServer
    // options so we are going to "massage" the warnings and errors and present
    // them in a readable focused way.
    var messages = formatWebpackMessages(stats.toJson({}, true));
    var isSuccessful = !messages.errors.length && !messages.warnings.length;
    var showInstructions = isSuccessful && isFirstCompile;

    if (isSuccessful) {
      console.log(chalk.green('Webpack compiled successfully! No Errors, No Warnings.'));
      console.log();
    }

    if (showInstructions) {
      console.log();
      console.log('The app via Webpack is running at:');
      console.log();
      console.log('  ' + chalk.cyan(protocol + '://' + host + ':' + port + '/'));
      console.log();
      console.log('Note that the development build is not optimized.');
      console.log();
      isFirstCompile = false;
    }

    // If errors exist, only show errors.
    if (messages.errors.length) {
      console.log(chalk.bold.black('Webpack failed to compile.'));
      console.log();
      messages.errors.forEach(message => {
        console.log(message);
        console.log();
      });
      return;
    }

    // Show warnings if no errors were found.
    if (messages.warnings.length) {
      console.log(chalk.yellow('Webpack compiled with warnings.'));
      console.log();
      messages.warnings.forEach(message => {
        console.log(message);
        console.log();
      });
      // Teach some ESLint tricks.
      console.log('You may use special comments to disable some warnings.');
      console.log('Use ' + chalk.yellow('// eslint-disable-next-line') + ' to ignore the next line.');
      console.log('Use ' + chalk.yellow('/* eslint-disable */') + ' to ignore all warnings in a file.');
    }
  });
}

function runDevServer(host, port, protocol, callback) {
  var devServer = new WebpackDevServer(compiler, {
    // Enable gzip compression of generated files.
    compress: true,
    // Silence WebpackDevServer's own logs since they're generally not useful.
    // It will still show compile warnings and errors with this setting.
    // By default WebpackDevServer serves physical files from current directory
    // in addition to all the virtual build products that it serves from memory.
    // This is confusing because those files won’t automatically be available in
    // production build folder unless we copy them. However, copying the whole
    // project directory is dangerous because we may expose sensitive files.
    // Instead, we establish a convention that only files in `public` directory
    // get served. Our build script will copy `public` into the `build` folder.
    // In `index.html`, you can get URL of `public` folder with %PUBLIC_PATH%:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In JavaScript code, you can access it with `process.env.PUBLIC_URL`.
    // Note that we only recommend to use `public` folder as an escape hatch
    // for files like `favicon.ico`, `manifest.json`, and libraries that are
    // for some reason broken when imported through Webpack. If you just want to
    // use an image, put it in `src` and `import` it from JavaScript instead.
    historyApiFallback: true,
    stats: {
      hot: true,
      inline: true,
      assets: true,

      // noInfo: true,
      colors: true,
      hash: false,
      cached: false,
      chunks: false,
      chunkModules: true,
      modules: false,
      cachedAssets: false
    },
    // clientLogLevel: 'none',
    // Enable hot reloading server. It will provide /sockjs-node/ endpoint
    // for the WebpackDevServer client so it can learn when the files were
    // updated. The WebpackDevServer client is included as an entry point
    // in the Webpack development configuration. Note that only changes
    // to CSS are currently hot reloaded. JS changes will refresh the browser.
    hot: true,
    quiet: true,
    disableHostCheck: true,
    // It is important to tell WebpackDevServer to use the same "root" path
    // as we specified in the config. In development, we always serve from /.
    publicPath: '/' + config.output.publicPath,
    // WebpackDevServer is noisy by default so we emit custom message instead
    // by listening to the compiler events with `compiler.plugin` calls above.
    // quiet: true,
    // Reportedly, this avoids CPU overload on some systems.
    // https://github.com/facebookincubator/create-react-app/issues/293
    watchOptions: {
      ignored: /node_modules/
    },
    proxy: {
      '**': paths.proxy
    },
    // Enable HTTPS if the HTTPS environment variable is set to 'true'
    https: protocol === 'https',
    host: host
  });

  // Our custom middleware proxies requests to /index.html or a remote API.
  // addMiddleware(devServer);

  // Launch WebpackDevServer.
  devServer.listen(port, (err, result) => {
    if (err) {
      return console.log(err);
    }

    if (isInteractive) {
      // clearConsole();
    }
    console.log(chalk.cyan('Starting the development server...'));
    console.log();

    openBrowser(protocol + '://' + host + ':' + port + '/');
    callback();
  });
}

function run(port, callback) {
  var protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
  var host = process.env.HOST || 'locahost';
  setupCompiler(host, port, protocol);
  runDevServer(host, port, protocol, callback);
}

// We attempt to use the default port but if it is busy, we offer the user to
// run on a different port. `detect()` Promise resolves to the next free port.
/* detect(DEFAULT_PORT).then(port => {
  if (port === DEFAULT_PORT) {
    run(port);
    return;
  }

  if (isInteractive) {
    // clearConsole();
    var existingProcess = getProcessForPort(DEFAULT_PORT);
    var question =
      chalk.yellow('Something is already running on port ' + DEFAULT_PORT + '.' +
        ((existingProcess) ? ' Probably:\n  ' + existingProcess : '')) +
        '\n\nWould you like to run the app on another port instead?';

    prompt(question, true).then(shouldChangePort => {
      if (shouldChangePort) {
        run(port);
      }
    });
  } else {
    console.log(chalk.red('Something is already running on port ' + DEFAULT_PORT + '.'));
  }
});
*/
// run(DEFAULT_PORT);

module.exports = run;
