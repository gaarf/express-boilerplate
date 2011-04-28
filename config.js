module.exports = function(app, express) {

  var BASE_VIEW_OPTIONS =
    { title: 'Express HTML5 Boilerplate'
    , meta: { desc: 'Boilerplate'
            , version: '0.0.1'
            , author: { name: 'gaarf'
                      , href: 'http://gaarf.info'
                      }
            }
    , jquery: { version: '1.5.2' }
  };

  app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.use(express.favicon());
  });

  app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });

  app.configure('production', function(){
    app.use(express.errorHandler());
  });

  return require('./etc/routes.js')(app,BASE_VIEW_OPTIONS);
}
