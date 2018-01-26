var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
var InterpolateHtmlPlugin = require('inferno-dev-utils/InterpolateHtmlPlugin');
var WatchMissingNodeModulesPlugin = require('inferno-dev-utils/WatchMissingNodeModulesPlugin');
const fs = require('fs');
const path = require('path');
var getClientEnvironment = require('./env');
var paths = require('./paths');

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
var publicPath = '/';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
var publicUrl = '';
// Get environment variables to inject into our app.
var env = getClientEnvironment(publicUrl);

var entryApps = {};
var dirs = [];
var files = fs.readdirSync(paths.appSrc);

files.forEach(function(file) {
  let full = path.join(paths.appSrc, file);
  if (fs.statSync(full).isDirectory() && file.indexOf('_off') === -1) dirs.push(file);
});

dirs.forEach(function(appname) {
  entryApps[appname] = [
    require.resolve(paths.root + '/lib/local_modules/webpackHotDevClient/webpackHotDevClient'),
    // We ship a few polyfills by default:
    require.resolve('./polyfills'),
    path.join(paths.appSrc, appname)
  ];
});

module.exports = {
  devtool: 'cheap-module-source-map',
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
      chalk: path.join(paths.root, 'lib/local_modules/chalk'),
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
        test: /\.(js|jsx)$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        exclude: /(node_modules|local_modules)/,
        options: {
          configFile: path.resolve('./apps-inferno/.eslintrc')
        },
        include: paths.appsInferno
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              url: false,
              sourceMap: true,
              minimize: true,
              importLoaders: 1,
              localIdentName: '[folder]__[local]'
            }
          },
          {
            loader: 'clean-css-loader',
            options: {
              compatibility: 'ie8',
              level: 2
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: function() {
                return [require('precss'), require('autoprefixer')];
              }
            }
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true
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
              sourceMap: true,
              importLoaders: 1,
              localIdentName: '[folder]__[local]'
            }
          }
        ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [
            [
              'env',
              {
                useBuiltIns: 'usage',
                debug: true,
                targets: {
                  browsers: ['last 2 versions', 'not ie > 8', 'ie 11', 'ie 10', 'not android > 4', 'not edge > 10']
                }
              }
            ],
            'stage-2'
          ],
          plugins: ['transform-decorators-legacy', 'transform-async-to-generator', ['inferno', { imports: true }], 'syntax-jsx'],
          cacheDirectory: true
        },
        include: paths.appsInferno
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
        test: /\.txt$/,
        use: 'raw-loader'
      }
    ]
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.DefinePlugin({
      __SERVER__: false,
      __CLIENT__: true,
      __DEV__: true,
      __PRODUCTION__: false,
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules)
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};
