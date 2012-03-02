var boot = require('./testboot.js')
  , repl = require('repl')
  , context = repl.start("JS> ").context
  , _ = boot.kit.underscore;

context.__ = _;
context.l = console.log;

context.setThing = function(thing) {
  console.log('set thing:', thing);
  context.thing = thing;
}

_.extend(context, boot);

