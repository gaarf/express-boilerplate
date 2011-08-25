var express = require('express')
  , app = express.createServer()
  , IS_PRODUCTION = process.env['NODE_ENV']=='production';

module.exports = require('./boot.js').boot(app, express);

if (!module.parent) {

  app.listen(IS_PRODUCTION ? 80 : 3000);
  console.log("Express server listening on port %d", app.address().port);

}