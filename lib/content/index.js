const path = require('path');
const config = require('../config');

const dataPath = config.dataPath;
const defaultLocale = config.defaultLocale;


module.exports = function getPageContent(page, locale) {

  if(!locale) {

    locale = defaultLocale;
  }

  return require(path.resolve(dataPath, 'pages', locale, page));
}