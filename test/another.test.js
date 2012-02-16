var should = require('should'),
    boot = require('../testboot.js'),
    helper = boot.helper;


describe('With server listening', function(){
  before(helper.serverListen)
  after(helper.serverStop)

  describe('favicon', function(){

    it('responds ok', function(done){
      helper.localRequest('GET /favicon.ico', function(res) {
        res.should.have.status(200);
        done();
      })
    })

  })

})

describe('kit', function(){

  it('contains utilities', function(){
    boot.kit.model.should.be.a('object').and.have.property('User');
    boot.kit.middleware.should.be.a('object');
    boot.kit.sessionStorage.should.be.a('object');
    boot.kit.dateformat.should.be.a('function');
    boot.kit.parallelize.should.be.a('function');
    boot.kit.secrets.get.should.be.a('function');
  })

  it('does not contain bbq', function(){
    boot.kit.should.be.a('object');
    boot.kit.should.not.have.property('req')
    boot.kit.should.not.have.property('res')
    boot.kit.should.not.have.property('app')
    boot.kit.should.not.have.property('bbq')
  })


})
