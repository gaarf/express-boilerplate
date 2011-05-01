
// Run $ expresso

/**
 * Module dependencies.
 */

var app = require('../app')
  , assert = require('assert');


module.exports = {
  'GET /': function(){
    assert.response(app,
      { url: '/' },
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' }},
      function(res){
        assert.includes(res.body, 'express-boilerplate');
        assert.includes(res.body, 'window.jQuery || document.write');
        assert.includes(res.body, 'src="/javascripts/client.js"');
      });
  },

  'GET /help': function(){
    assert.response(app,
      { url: '/help' },
      { status: 200 },
      function(res){
        assert.includes(res.body, 'RTFM');
      });
  },

  'GET /404': function(){
    assert.response(app,
      { url: '/404' },
      { status: 404 },
      function(res){
        assert.includes(res.body, '404');
      });
  }

};