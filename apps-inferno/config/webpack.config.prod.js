var webpack = require('webpack');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var url = require('url');
var paths = require('./paths');
var getClientEnvironment = require('./env');
const fs = require('fs');
const path = require('path');
const argv = require('optimist').argv;

// const ExtractTextPlugin = require('extract-text-webpack-plugin');

// const extractLess = new ExtractTextPlugin({
//     filename: '[name].[contenthash].css',
//     disable: process.env.NODE_ENV === 'development'
// });

function ensureSlash(path, needsSlash) {
  var hasSlash = path.endsWith('/');
  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1);
  } else if (!hasSlash && needsSlash) {
    return path + '/';
  } else {
    return path;
  }
}

// We use "homepage" field to infer "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
var homepagePath = '/';
var homepagePathname = homepagePath ? url.parse(homepagePath).pathname : '/';
// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
var publicUrl = ensureSlash(homepagePathname, false);
// Get environment variables to inject into our app.
var env = getClientEnvironment(publicUrl);

// Assert this just to be safe.
// Development builds of Inferno are slow and not intended for production.
if (env['process.env'].NODE_ENV !== '"production"') {
  throw new Error('Production builds must have NODE_ENV=production.');
}

var entryApps = {};
var dirs = [];
var files = fs.readdirSync(paths.appSrc);

files.forEach(function(file) {
  let full = path.join(paths.appSrc, file);
  if (fs.statSync(full).isDirectory() && file.indexOf('_off') === -1) dirs.push(file);
});

dirs.forEach(function(appname) {
  entryApps[appname] = [
    require.resolve('./polyfills'),
    path.join(paths.appSrc, appname)
  ];
});

let eoverlayModuleModules = '../../../eoverlay-module/node_modules/';

// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
module.exports = {
  // Don't attempt to continue if there are any errors.
  bail: true,
  externals: {
    jquery: '$'
  },
  entry: entryApps,
  context: __dirname,
  target: 'web',
  output: {
    publicPath: paths.appPublicPath,
    filename: '[name].js',
    path: paths.appBuild
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      'lib/shared': path.join(paths.root, 'lib/shared'),
      'jsx-filters': path.join(paths.root, 'apps-inferno/shared/filters/jsx'),
      'shared/inferno': path.join(paths.root, 'apps-inferno/src/shared'),
      'apps/shared': path.join(paths.root, 'apps-inferno/shared'),
      'public/js': path.join(paths.root, 'public/js')
    }
  },
  module: {
    rules: [
      {
          test: /\.(html)$/,
          loader: '../../../eoverlay-module/lib/html-loader',
          options: {
            minimize: true,
            collapseWhitespace: true,
            lzstring: true
          }
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        include: paths.appsInferno,
        loader: 'babel-loader',
        query: {
          // presets: ['es2015', 'stage-2'],
          presets: [
            [
              'env',
              {
                useBuiltIns: 'usage',
                // useBuiltIns: false,
                debug: true,
                targets: {
                  browsers: ['> 1%', 'ie 11', 'ie 10', 'safari > 9']
                }
              }
            ],
            'stage-2'
          ],
          plugins: ['transform-decorators-legacy', 'transform-async-to-generator', ['inferno', { imports: true }], 'syntax-jsx'],
          // This is a feature of `babel-loader` for webpack (not Babel itself).
          // It enables caching results in ./node_modules/.cache/babel-loader/
          // directory for faster rebuilds.
          cacheDirectory: true
        }
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url?limit=25000'
      },
      {
        test: /\.json/,
        loader: 'json-loader'
      },
      {
        test: /\.(less|lesss)$/,
        use: [
          {
            loader: eoverlayModuleModules + 'style-loader'
          },
          {
            loader: eoverlayModuleModules + 'css-loader',
            options: {
              url: false,
              sourceMap: false,
              minimize: true,
              importLoaders: 1,
              localIdentName: '[folder]__[local]'
            }
          },
          {
            loader: eoverlayModuleModules + 'clean-css-loader',
            options: {
              compatibility: 'ie8',
              level: 2
            }
          },
          {
            loader: eoverlayModuleModules + 'postcss-loader',
            options: {
              sourceMap: false,
              plugins: function() {
                return [require(eoverlayModuleModules + 'precss'), require(eoverlayModuleModules + 'autoprefixer')];
              }
            }
          },
          {
            loader: eoverlayModuleModules + 'less-loader',
            options: {
              sourceMap: false
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              url: false,
              sourceMap: false,
              importLoaders: 1,
              localIdentName: '[folder]__[local]'
            }
          }
        ]
      },
      {
        test: /\.dust$/,
        loader: '../../../eoverlay-module/lib/dust-loader?_no_whitespacestrue'
      },
      {
        test: /\.txt$/,
        use: 'raw-loader'
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      dust: 'dustjs-linkedin'
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.DefinePlugin({
      __SERVER__: false,
      __CLIENT__: true,
      __DEV__: false,
      __GOOGLE_ANALYTICS__: false,
      __BRANDING__: true,
      __USEFORM__: true,
      __USEFORMCSS__: true,
      __BUILDER__: true,
      __PRODUCTION__: true,
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    // This helps ensure the builds are consistent if source hasn't changed:
    new webpack.optimize.OccurrenceOrderPlugin(),
    // Try to dedupe duplicated modules, if any:
    // Minify the code.
    
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        screw_ie8: true, // Inferno doesn't support IE8
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    }),
    new BundleAnalyzerPlugin({
    // Can be `server`, `static` or `disabled`.
    // In `server` mode analyzer will start HTTP server to show bundle report.
    // In `static` mode single HTML file with bundle report will be generated.
    // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
    analyzerMode: 'static',
    // Host that will be used in `server` mode to start HTTP server.
    reportFilename: 'webpack-report.html',
    // Module sizes to show in report by default.
    // Should be one of `stat`, `parsed` or `gzip`.
    // See "Definitions" section for more information.
    defaultSizes: 'parsed',
    // Automatically open report in default browser
    openAnalyzer: argv.analyzer || argv.report ? true : false,
    // If `true`, Webpack Stats JSON file will be generated in bundles output directory
    generateStatsFile: false,
    // Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`.
    // Relative to bundles output directory.
    statsFilename: 'stats.json',
    // Options for `stats.toJson()` method.
    // For example you can exclude sources of your modules from stats file with `source: false` option.
    // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
    statsOptions: null,
    // Log level. Can be 'info', 'warn', 'error' or 'silent'.
    logLevel: 'info'
  })
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    Buffer: false,
    tls: 'empty'
  }
};
