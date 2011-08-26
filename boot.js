var fs = require('fs'),
    dbClient = require('./lib/database.js'),
    MysqlStore = require('./lib/mysqlstore.js'),
    secrets = require('./etc/secrets.js'),
    pkg = JSON.parse(fs.readFileSync('./package.json')),
    pkgAuthor = parsePerson(pkg.author);

module.exports.boot = function(app, express) {

  console.log("BOOTING UP "+pkg.name+" v"+pkg.version+"...");

  /**
   * Database
   */
  // var c = secrets.get('db');
  // dbClient.init(c.username, c.password, c.database);

  // var storage = MysqlStore.create(express, dbClient);
  var storage = new express.session.MemoryStore();

  /**
   * Application namespace
   */
  app.STUFF = {
     model: {},
     dbClient: dbClient,
     storage: storage
   }

  /**
   * Connect
   */
   app.configure('development', function(){
     app.use(express.profiler());
     app.use(express.logger());
   });

   app.configure(function(){
     app.set('views', __dirname + '/views');
     app.set('view engine', 'ejs');

     app.use(express.query());
     app.use(express.bodyParser());

     app.use(express.cookieParser());
     app.use(express.session({
       store: storage,
       cookie: { maxAge: 1000*60*60 }, // one hour
       secret: secrets.get('sessionHash')
     }));

     // app.use(express.methodOverride());
     // app.use(express.csrf());

     app.use(function(req, res, next) {
       res.locals(
         { meta: { title: pkg.name
                 , desc: pkg.description
                 , version: pkg.version
                 , author: pkgAuthor
                 }
         , page: {}
         , status: null
         , scripts: []
         , session: req.session
         , jquery: { version: '1.5.2' }
         }
       );
       next();
     });

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

  /**
  * Models
  */
  // fs.readdirSync('./models').forEach(function(file){
  //   if(file.match(/\.js$/)) {
  //     var model = require('./models/' + file);
  //     app.STUFF.model[model.def.name] = model.get(app);
  //   }
  // });

  /**
   * Routes
   */
  fs.readdirSync('./controllers').forEach(function(file){
    if(file.match(/\.js$/)) {
      require('./controllers/' + file).setRoutes(app, express);
    }
  });

  /**
   * Custom 404
   */
  app.use(function(req, res) {
    res.render('404', { status: 404, jquery: false } );
  });

  return app;
}


function parsePerson(person) {
  if (typeof person !== "string") return person;
  var name = person.match(/^([^\(<]+)/)
    , url = person.match(/\(([^\)]+)\)/)
    , email = person.match(/<([^>]+)>/)
    , obj = {};
  if (name && name[0].trim()) obj.name = name[0].trim();
  if (email) obj.email = email[1];
  if (url) obj.url = url[1];
  return obj;
}
