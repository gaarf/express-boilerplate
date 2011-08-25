module.exports.setRoutes = function(app) {

  app.get('/', function(req, res){
    res.render('index', {
      scripts: [ 'client.js' ],
      now: new Date()
    });
  });

  app.get('/help', function(req, res){
    res.render('help', {
      jquery: false
    });
  });

  app.get('/bad', function(req, res){
    omgWtfBbq(); // undefined
  });

  return app;
}


