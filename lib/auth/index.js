const _ = require('lodash');

const passport = require('passport');
const strategy = require('./strategy');

// the auth strategy
passport.use(strategy);

// the auth initialiser
module.exports = (app) => {

  app.use(passport.initialize());
  app.use(passport.session());
}

// authenticate middleware
module.exports.authenticate = (opts) => passport.authenticate(strategy.name, _.extend({failureRedirect: '/login'}, opts));

// ensure loggedIn middleware
module.exports.ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

// ensuer logged out middleware
module.exports.ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut;
