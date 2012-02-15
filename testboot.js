if(!module.parent) {
  return console.log("To run the tests verbosely, use `mocha --reporter spec`");
}

/**
 * Boot the app for tests, and export some helpers
 */

var boot = require('./boot.js'),
    http = require('http');

exports.app = app = boot.app;

exports.kit = boot.kit;

exports.helper = {

  serverListen: function(done) {
    if(!app.address()) {
      app.listen(3001, function() {
        console.log("[test] serverListen on port %d in %s mode", app.address().port, app.settings.env);
        setTimeout(done, 100); // FIXME - wait a bit for everything to warm up
      });
    }
    else done();
  },

  serverStop: function(done) {
    app.close();
    console.log("[test] serverStop");
    done();
  },

  localRequest: localRequest // poor-man's assert.response

};

function localRequest(what, opts, callback) {
  if(!callback) {
    callback = opts;
    opts = {};
  }

  var data = opts.data || null,
      address = boot.app.address();

  if(!address) throw 'localRequest needs a listening server!!!';

  var m = what.match(/^(GET|POST|DELETE|PUT)\s+(\/[\w\-\/\.]*).*?$/),
      mPath = m && m[2];
  if(!mPath) throw 'localRequest needs a path or parsable context!!!';

  var method = (m && m[1]) || (data&&'POST') || 'GET';

  console.log("[test] localRequest: %s %s", method, mPath);

  var request = http.request({
        host: '127.0.0.1',
        port: address.port,
        path: mPath,
        method: method
      });

  if(opts.cookie) {
    request.setHeader("Cookie", opts.cookie);
  }

  request.on('response', function(response){
    response.body = '';
    response.on('data', function(chunk){ response.body += chunk; });
    response.on('end', function(){ 
      callback(response);
    });
  });

  if(data) {
    if(method=='GET'){
      var q = [], p = request.path;
      for (var k in data) {
        q.push(k + '=' + encodeURIComponent(data[k]));
      };
      request.path = p + (p.match(/\?/) ? '&' : '?') + q.join('&');
    }
    else {
      request.setHeader("Content-Type", "application/json");
      request.write(JSON.stringify(data));
    }
  }

  request.end();

}

