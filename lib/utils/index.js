const crypto = require('crypto');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));


module.exports.fileExists = fileExists;
module.exports.generateFileHash = generateFileHash;

/**
* path exists?
* @param path
*/
function fileExists(path) {


  return new Promise((resolve, reject) => {

    fs.statAsync(path)
      .then((stats) => resolve(stats))
      .catch((err) => {

        if(err.code === 'ENOENT') return resolve(false);

        reject(err);
      })
  })
}



/**
 * generate hash from paths
 * @param paths
 * @returns {Promise.<TResult>|*|Promise<U>|Thenable<U>}
 */
function generateFileHash(paths) {

  return Promise
    .map(paths, (path) => {

      return fs.statAsync(path)
        .then((stats) => {

          delete stats.atime

          return stats;
        });

    }).then((stats)=> {

      return crypto.createHash('md5').update(JSON.stringify(stats)).digest("hex");
    })
}