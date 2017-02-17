'use strict';

const PrettyError = require('pretty-error');
const pe = new PrettyError();

const express = require('express');
const app = express();

const debug = require('./lib/debug');

// debug routes
app.use(debug);

// public folder
app.use(express.static('public'));

// cookies
app.use(require('cookie-parser')());

// body parser
app.use(require('body-parser').urlencoded({ extended: false }));
app.use(require('body-parser').json());

// security
app.use(require('helmet')());

// compression
app.use(require('compression')());

// attach auth
require('./lib/auth')(app);

// bind the templating engine
require('./lib/templating')(app);

// attach routes
require('./lib/routes')(app);

// Errors
pe.skipNodeFiles();
pe.skipPackage('express');

app.use(function(err, req, res, next){

  debug.error(pe.render(err));

  next();
});

// export the app
module.exports = app;
