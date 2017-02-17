const marked = require('marked');

module.exports = {

  title: 'Web App',
  description: 'This is an isomorphic Web App',
  content: {
    hello: marked('hello!')
  }
}