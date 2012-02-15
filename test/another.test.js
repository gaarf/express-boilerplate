var should = require('should'),
    boot = require('../testboot.js'),
    helper = boot.helper;


describe('With server listening', function(){
  before(helper.serverListen)
  after(helper.serverStop)

  describe('favicon', function(){

    it('responds ok', function(done){
      helper.localRequest('GET /favicon.ico', function(res) {
        res.statusCode.should.equal(200);
        done();
      })
    })

  })

})

