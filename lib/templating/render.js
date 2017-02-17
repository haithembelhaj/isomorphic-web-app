const Promise = require('bluebird');
const dependencyTree = require('dependency-tree');
const debug = require('../debug');
const ReactDOM = require('react-dom/server');
const renderToString = ReactDOM.renderToString;

const config = require('../config');
const isDev = config.isDev;
const srcPath = config.srcPath;


// compile required react files
require('babel-register')({
  extensions: ['.jsx', '.js'],
  only: srcPath,
  env: process.env
});

/**
 * Render a template and return HTML
 * @param template
 * @param data
 */
module.exports = function renderer(template, data) {

  let view;
  let body;

  try {

    view = require(template);
    body = renderToString(view.default(data));

  } catch(err) {

    debug.error(err);

    return Promise.reject(err);
  }

  // get the dependency tree for all required files
  const deps = dependencyTree.toList({
    filename: template,
    directory: '/'
  });

  if(isDev) {

    // invalidate cache
    deps.map((dep) => {

      delete require.cache[require.resolve(dep)];
    });
  }

  return Promise.resolve(body);
};

