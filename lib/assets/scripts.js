const Promise = require('bluebird');
const path = require('path');
const mkdirp = require('mkdirp');
const debug = require('../debug');
const resolve = path.resolve;
const fs = Promise.promisifyAll(require('fs'));
const webpack = require('webpack');

const fileExists = require('../utils').fileExists;

// promisified compile script
const _compileScripts = Promise.promisify(_bundle);

const config = require('../config');

// paths
const srcPath = config.srcPath;
const destPath = config.destPath;

// scripts paths
const scriptsSrcPath = resolve(srcPath, 'scripts');
const scriptsDestPath = resolve(destPath, 'scripts');

// create destination folders if missing
mkdirp.sync(scriptsDestPath);

module.exports = compileScripts;


/**
 * compile scripts files
 * @param paths
 * @param view
 * @param opts
 */
function compileScripts(paths, view, opts){

  // fix paths relativity
  paths = paths.map((path) => resolve(scriptsSrcPath, path));

  return filterPaths(paths)
    .then((_paths) => {

      const scriptsPath = resolve(scriptsDestPath, view + '.js');

      return _compileScripts(_paths, scriptsPath, opts);
    });
}

/**
 * bundle
 * @param paths
 * @param outFile
 * @param opts
 * @param cb
 * @private
 */
function _bundle(paths, outFile, opts, cb) {

  // returns a Compiler instance
  webpack({
    cache: true,
    entry: paths,
    output: { path: scriptsDestPath, filename: path.basename(outFile) },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          query: {
            presets: ['es2015', 'react']
          }
        }
      ],
      preLoaders: [
        {
          test: /\.jsx$/,
          exclude: /node_modules/,
          loader: 'view-loader'
        }
      ]
    },
    plugins: opts.production ? [
        new webpack.DefinePlugin({'process.env': {NODE_ENV: JSON.stringify('production')}}),
        new webpack.optimize.UglifyJsPlugin()
      ] : [],
    resolveLoader: {
      fallback: [
        path.resolve(__dirname, 'loaders'),
        path.join(process.cwd(), 'node_modules')
      ]
    }
  }, (err, stats) => {

    debug.log(stats.toString('normal'));

    cb(err, `/scripts/${stats.hash}.js`);
  });

}

/**
 * filter only existing paths
 * @param paths
 * @returns {*}
 */
function filterPaths(paths) {

  return Promise.filter(paths, fileExists);
}
