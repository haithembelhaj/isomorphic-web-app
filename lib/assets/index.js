const Promise = require('bluebird');
const debug = require('../debug');
const compileScripts = require('./scripts');
const compileStyles = require('./styles');


// exports
module.exports.compile = compile;
module.exports.compileScripts = compileScripts;
module.exports.compileStyles = compileStyles;

/**
 * compile all assets
 * @param assets
 * @param opts
 * @returns {Thenable<U>|*|Promise.<TResult>|Promise<U>}
 */
function compile(assets, opts) {

  if(!opts) {

    opts = {};
  }

  debug.log('compiling', assets);

  const queue = [];

  if(assets.styles) {

    queue.push(compileStyles(assets.styles, assets.view, opts));
  }

  if(assets.scripts) {

    queue.push(compileScripts(assets.scripts, assets.view, opts));
  }

  return Promise.all(queue).then((results) => {

    return {
      styles: results[0],
      scripts: results[1]
    };
  });
}