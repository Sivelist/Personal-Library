/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
            .post('/api/books')
            .send({title: 'fcc test'})
            .end(function(err,res){
            
            assert.equal(res.status, 200);
          // console.log(res.body);
            assert.isObject(res.body, 'response should be an Object');
            assert.property(res.body, 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body, 'title', 'Books in array should contain title');
            assert.property(res.body, '_id', 'Books in array should contain _id');
            assert.propertyVal(res.body, 'title', 'fcc test');
            assert.equal(res.body.comments.length, 0);
            assert.propertyVal(res.body, 'commentcount', 0);
            done();
          
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
            .post('/api/books')
            .send({title: ''})
            .end(function(err,res){
            
            assert.equal(res.status, 200);
          // console.log(res.body);
            assert.isObject(res.body, 'response should be an Object');
            assert.property(res.body, 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body, 'title', 'Books in array should contain title');
            assert.property(res.body, '_id', 'Books in array should contain _id');
            assert.propertyVal(res.body, 'title', '');
            assert.equal(res.body.comments.length, 0);
            assert.propertyVal(res.body, 'commentcount', 0);
            done();
          
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .query({})
        .end(function(err,res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          // console.log(res.body);
          assert.property(res.body[0], 'title');
          assert.property(res.body[0], 'comments');
          assert.property(res.body[0], 'commentcount');
          done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/5d2352254c55f80f293cc999')
        .end(function(err,res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'no book exists');
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get('/api/books/5d235e777ed9303232823047')
        .end(function(err,res){
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          // console.log(res.body);
          assert.propertyVal(res.body, 'title', 'fcc test');
          assert.equal(res.body.comments.length, 0);
          done();
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        this.timeout(15000);
        setTimeout(done,15000);
        chai.request(server)
            .post('/api/books/5d235ed1264a0433e9e5b413')
            .send({_id: '5d235ed1264a0433e9e5b413',
                    comment: 'this is a test comment'})
            .end(function(err,res){
          // console.log(res.body);
            assert.isObject(res.body, 'response should be an Object');
            assert.property(res.body, 'title', 'Books in array should contain title');
            assert.property(res.body, '_id', 'Books in array should contain _id');
            assert.property(res.body, 'comments', 'Books in array should comments');
            assert.propertyVal(res.body, 'title', 'fcc test');
            assert.equal(res.body.comments.length, 1);
            assert.equal(res.body.comments[0], ['this is a test comment'])
            done();
          
        });
      });
      
    });

  });

});
