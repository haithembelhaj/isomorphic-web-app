const Promise = require('bluebird');
const path = require('path');
const mkdirp = require('mkdirp');
const debug = require('../debug');
const resolve = path.resolve;
const fs = Promise.promisifyAll(require('fs'));
const sass = Promise.promisifyAll(require('node-sass'));
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const config = require('../config');
const fileExists = require('../utils').fileExists;

// paths
const srcPath = config.srcPath;
const destPath = config.destPath;

// styles paths
const stylesSrcPath = resolve(srcPath, 'styles');
const stylesDestPath = resolve(destPath, 'styles');
const svgsPath = resolve(srcPath, 'assets/svgs');


// create destination folders if missing
mkdirp.sync(stylesDestPath);

// exports
module.exports = compileStyles;


/**
 * Compile styles files
 * @param paths
 * @param view
 * @param opts
 */
function compileStyles(paths, view, opts) {

  // fix paths relativity
  paths = paths.map((path) => resolve(stylesSrcPath, path));

  return filterPaths(paths)
    .then((_paths) => {

      const stylesPath = resolve(stylesDestPath, view + '.css');

      return _compileStyles(_paths, stylesPath, opts);
    });
}

/**
 * actual compilation of styles
 * @param paths
 * @param outFile
 * @param opts
 * @returns {Promise.<TResult>|*|Promise<U>|Thenable<U>}
 * @private
 */
function _compileStyles(paths, outFile, opts) {

  // reverse and map to sass imports
  const _paths = paths.reverse().map((path) => `@import "${path}";`);

  return sass.renderAsync({

    data: `${_paths.join('')}`,
    outFile: outFile,
    sourceMap: true,
    includePaths: [stylesSrcPath],
    importer: [require('compass-importer')],
    functions: {
      svg: require('sass-inline-svg')(svgsPath),
      inline: inline
    }
  }).then((res) => {

    debug.log('sass compilation duration:', res.stats.duration+'ms');

    const preprocessors = [autoprefixer({ browsers: 'last 2 version' })];

    if(opts.production) {

      preprocessors.push(cssnano());
    }

    return postcss(preprocessors)
      .process(res.css).then((result) => {

        result.warnings().forEach((warn) => {

          debug.log(warn.toString());
        });

        return result.css;
      });
  })
    .then((css) => fs.writeFileAsync(outFile, css));

}

/**
 * sass inline function
 */
function inline(file, done) {

  file = file.getValue();

  file = file.indexOf('/') === 0 ? file.slice(1) : file;

  const filePath = path.resolve(destPath, file);
  const parsedPath = path.parse(filePath);


  fs.readFileAsync(filePath).then((data)=> {

    const base64 = new Buffer(data).toString('base64');

    done(sass.types.String(`url("data:image/${parsedPath.ext.slice(1)};base64,${base64}")`));
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
