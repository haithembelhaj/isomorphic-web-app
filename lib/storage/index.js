const Promise = require('bluebird');
const resolve = require('path').resolve;
const Datastore = require('nedb');

const db = new Datastore({
  filename: resolve(__dirname, '../../data/db'),
  timestampData: true,
  autoload: true
});

// export
module.exports = Promise.promisifyAll(db);