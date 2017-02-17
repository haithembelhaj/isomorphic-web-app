const _ = require('lodash');
const resolve = require('path').resolve;
const render = require('./render');
const express = module.parent.require('express');
const response = express.response;

const config = require('../config');

const srcPath = config.srcPath;
const componentFilenameServer = config.componentFilenameServer;

const reqProps = ['baseUrl', 'body', 'cookies', 'fresh', 'hostname', 'ip', 'method', 'originalUrl', 'params', 'path', 'protocol', 'query', 'route', 'secure'];

/**
 * add render function to response object
 * renders a view using ./render
 * @param view
 * @param data
 * @returns {*}
 */
response.render = function(view, data) {

  const res = this;
  const req = res.req;
  const app = res.app;
  const globals = _.extend({req: _.pick(req, reqProps)}, app.locals, res.locals);

  data = _.extend(data, {global: globals});

  // set res type to HTML
  res.set({ 'content-type': 'text/html; charset=utf-8'});

  return render(resolve(srcPath, 'views', view, componentFilenameServer), data)
    .then((body) => {

      res.send(layout(view, body, data));
  });
};

/**
 * some simple layout
 * @param view
 * @param body
 * @param data
 * @returns {string}
 */
function layout(view, body, data) {

  const page = data.page || {};

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${page.title}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <meta property=”og:title” content=”${page.title}”/>
        <meta property=”twitter:title” content=”${page.title}”/>
        <meta name=”description” content=”${page.description}”>
        <meta property=”og:description” content=”${page.description}”/>
        <meta property=”twitter:description” content=”${page.description}”/>
        <link rel="stylesheet" href="/styles/${view}.css">
      </head>
      <body>
        <div id="root">${body}</div>
        <script>window.viewData = ${JSON.stringify(data)}</script>
        <script src="/scripts/${view}.js" async></script>
        <script>
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
          ga('create', '${config.googleAnalyticsId}', 'auto');
          ga('send', 'pageview');
        </script>
      </body>
    </html>
  `;
}

// export nothing for the time being
module.exports = function(app) {}