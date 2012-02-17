var _ = require('underscore'),
    repl = require('repl'),
    boot = require('./testboot.js');

var context = repl.start("JS> ").context;

context.__ = _;
context.l = console.log;

context.setThing = function(thing) {
  console.log('set thing:', thing);
  context.thing = thing;
}

_.extend(context, boot);

