var IS_PROD = process.env['NODE_ENV']=='production';

/**
 * std libs
 */
 var express = require('express'),
    _ = require('underscore'),
    fs = require('fs'),

/**
 * custom libs
 */
    libMisc = require('./lib/misc.js'),
    libMiddleware = require('./lib/middleware.js'),

/**
 * pkg info
 */
    pkg = require('./package.json'),
    pkgAuthor = libMisc.parsePerson(pkg.author);

console.log("BOOTING UP "+pkg.name+" v"+pkg.version+" / node v"+process.versions.node+"...");

/**
 * Kit
 */
var kit = {
  model: {},
  dateformat: require('dateformat'),
  secrets: require('./etc/secrets.js'),
  parallelize: libMisc.parallelize,
  middleware: libMiddleware.base
};

var m = kit.secrets.get('mongoUrls'),
  MONGO_SESS_URL = m.sess + (m.sess.charAt(m.sess.length-1)=='/' ? pkg.name + '-sess' : ''),
  MONGO_DATA_URL = m.data + (m.data.charAt(m.data.length-1)=='/' ? pkg.name + '-data' : '');

/**
 * Sessions
 */
var MongoStore = require('connect-mongodb');
kit.sessionStorage = new MongoStore({ url: MONGO_SESS_URL });

kit.middleware.session = express.session({
  store: kit.sessionStorage,
  secret: kit.secrets.get('sessionHash'),
  cookie: { maxAge: 1000*60*60*24*7 } // one week
});


/**
 * Mongo ODM
 */
var mongoose = require('mongoose');
mongoose.connect(MONGO_DATA_URL);


/**
* Schemas
*/
var schemas = {};
_.forEach(fs.readdirSync('./models'), function(file){
  if(file.match(/\.js$/)) {
    var s = require('./models/' + file);
    if(s.name) {
      schemas[s.name] = s.get(mongoose);
    }
  }
});

/**
* Auth
*/
var mongooseAuth = require('mongoose-auth');
require('./lib/auth.js').config(kit, schemas.User, mongooseAuth);

/**
* Models
*/
_.forEach(schemas, function(schema, name){
  kit.model[name] = mongoose.model(name, schema);
});


/**
 * Connect
 */
 var app = express.createServer();

 app.configure('development', function(){
   if(!module.parent) {
     // app.use(express.profiler());
     app.use(express.logger('dev'));
   }
 });

 app.configure(function(){
   app.set('views', __dirname + '/views');
   app.set('view engine', 'ejs');

   app.use(express.favicon());
   app.use(express.static(__dirname + '/public'));

   app.use(express.query());
   app.use(express.bodyParser());
   app.use(express.cookieParser());
   app.use(kit.middleware.session);

   app.use(function(req, res, next) {
     var a = app.address();
     res.locals(
       { meta: { title: pkg.name
               , desc: pkg.description
               , version: pkg.version
               , author: pkgAuthor
               }
       , page: {
         className: ''
       }
       , status: null
       , jquery: true
       , bootstrap: true
       , stylesheets: []
       , scripts: []
       , req: req
       , dateformat: kit.dateformat
       , path: '' // kit.middleware.parsePath will populate from route
       , errors: {}
       }
     );
     next();
   });

   app.use(express.methodOverride());
   app.use(express.csrf());

   app.use(mongooseAuth.middleware());

   app.use(app.router); // cf https://github.com/bnoguchi/mongoose-auth/issues/52
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


/**
 * Dynamic View Helpers
 */
mongooseAuth.helpExpress(app);


/**
 * Routes
 */
fs.readdirSync('./controllers').forEach(function(file){
  if(file.match(/\.js$/)) {
    require('./controllers/' + file).setRoutes(app, kit);
  }
});


app.use(kit.middleware.fourOhFour);


// --------------------------------------------------------------------------------------

function up() {
  process.on('uncaughtException', function (exception) {
    // danger! see https://github.com/joyent/node/issues/2582
    console.error("\nuncaughtException", exception);
  });

  app.listen(IS_PROD ? 8080 : 3000, function() {
    console.log("%s - Listening on port %d in %s mode", (new Date()).toISOString(), app.address().port, app.settings.env);
  });
}

if(!module.parent) {
  up();
}

module.exports = {
  up: up,
  app:app,
  kit:kit
}

