const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const user = {

  username: 'admin',
  password: 'admin'
}

passport.serializeUser((user, done) => {

  done(null, user.username)
});
passport.deserializeUser((id, done) => {

  done(null, user)
});

module.exports = new LocalStrategy((username, password, done) => {

  if(username === user.username && password === user.password)
    return done(null, user);

  return done(null, false);
});