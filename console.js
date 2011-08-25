var _ = require('underscore'),
    repl = require('repl'),
    app = require('./app.js');

var context = repl.start("app> ").context;
context.app = app;
context.__ = _;
_.extend(context, app.STUFF.model)

