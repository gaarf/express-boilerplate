module.exports.setRoutes = function(app, kit) {

  app.get('/', function(req, res) {
    res.render('misc/about', {
      page:{
        title: 'About this app',
        className: 'about'
      }
    });
  });


  app.get('/account', kit.middleware.redirIfNotLoggedIn, function(req, res) {
    res.json(req.user);
  });

  return app;
}

