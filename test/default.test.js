var should = require('should'),
    boot = require('../testboot.js'),
    helper = boot.helper;


describe('With server listening', function(){
  before(helper.serverListen)
  after(helper.serverStop)

  describe('homepage', function(){

    it('responds ok', function(done){
      helper.localRequest('GET /', function(res) {
        res.should.have.status(200);
        res.body.should.include('is running fine');
        done();
      })
    })

  })

  // describe('page that causes an error', function(){
  // 
  //   it('shows express error page', function(){
  //     helper.localRequest('GET /bad', function(res) {
  //       res.should.have.status(500);
  //       res.body.should.include('omgWtfBbq is not defined');
  //       done();
  //     })
  //   })
  // 
  // })

  describe('page that does not exist', function(){
  
    it('is not found', function(){
      helper.localRequest('POST /four.ofour', function(res) {
        res.should.have.status(404);
        done();
      })
    })
  
  })

})

