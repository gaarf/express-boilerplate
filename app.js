var express = require('express')
  , app = express.createServer();

module.exports = require('./config.js')(app, express);

if (!module.parent) {

  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);

}