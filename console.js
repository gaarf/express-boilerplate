var _ = require('underscore'),
    repl = require('repl'),
    boot = require('./testboot.js');

var command = process.argv[2] || '';

if(command.match(/routes/)) {
  (function(o) {
    _.each(['get', 'put', 'post', 'delete'], function(method) {
      _(boot.app.routes.routes[method]).chain()
        .pluck('path').each(function(path) { o[path] ? o[path].push(method) : o[path] = [method]; });
    });
    var urls = _.keys(o).sort();
    console.log('\033[31m'+urls.length+' routed URLs\033[0m');
    _.each(urls, function(path) {
      console.log('\033[37m'+path + ' \033[34m' + _.uniq(o[path]).join(' ').toUpperCase()+'\033[0m');
    });
  })({});
  process.exit();
}


var context = repl.start("JS> ").context;

context.__ = _;
context.l = console.log;

context.setThing = function(thing) {
  console.log('set thing:', thing);
  context.thing = thing;
}

_.extend(context, boot);

