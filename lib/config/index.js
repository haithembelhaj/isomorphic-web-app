const resolve = require('path').resolve;
const env = process.env;

// is dev
const isDev = env.NODE_ENV === 'development';

// paths
const rootPath = resolve(__dirname, '../../');
const srcPath = resolve(rootPath, 'app');
const destPath = resolve(rootPath, 'public');
const dataPath = resolve(rootPath, 'data');

// the component code to load on the client
const componentFilenameClient = 'client.js';
// the component code to load on the server
const componentFilenameServer = 'template.jsx';
// the component styles filename
const componentFilenameStyles = 'styles.scss';

const googleAnalyticsId = '';

const defaultLocale = 'en';

module.exports = {

  isDev,
  rootPath,
  srcPath,
  destPath,
  dataPath,
  componentFilenameClient,
  componentFilenameServer,
  componentFilenameStyles,
  defaultLocale,
  googleAnalyticsId
};

