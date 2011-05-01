module.exports.configure = function(app, express) {

  var pkg = readJsonFile('./package.json')
    , BASE_VIEW_OPTIONS =
      { title: pkg.name
      , meta: { desc: pkg.description
              , version: pkg.version
              , author: parsePerson(pkg.author)
              }
      , jquery: { version: '1.5.2' }
  };

  console.log("Configuring "+pkg.name+" v"+pkg.version+"...");

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

  require('./etc/routes.js').setRoutes(app,BASE_VIEW_OPTIONS);

  return app;
}

function readJsonFile(file) {
  return JSON.parse(require('fs').readFileSync(file));
}

function parsePerson(person) {
  if (typeof person !== "string") return person;
  var name = person.match(/^([^\(<]+)/)
    , url = person.match(/\(([^\)]+)\)/)
    , email = person.match(/<([^>]+)>/)
    , obj = {};
  if (name && name[0].trim()) obj.name = name[0].trim();
  if (email) obj.email = email[1];
  if (url) obj.href = url[1];
  return obj;
}
