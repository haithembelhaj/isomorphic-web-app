const getPageContent = require('../content');
const debug = require('../debug');

module.exports = (app) => {

  // index
  app.get('/', (req, res, next) => {

    const page = getPageContent('index');

    res
      .render('index', {page})
      .catch(next);
  });

  // render error view
  app.use((err, req, res, next)=> {

    debug.error(err);

    if (res.headersSent) {

      return next(err);
    }

    res.status(500);
    res.render('error', { error: err });
  });
};
