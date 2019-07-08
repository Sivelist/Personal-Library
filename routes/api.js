/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app,db) {

  app.route('/api/books')
  
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    db.db('test').collection('books').find({}).toArray((err,result)=>{
                                                         // console.log(result);
                                                         res.json(result);
                                                         });
    })
    
  
  
  
  
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
    console.log(title);
    var createBook = {
      title: title,
      comments: [],
      commentcount: 0
    };
    
    db.db('test').collection('books').insertOne(
      createBook
    );
    res.json(createBook);
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    db.db('test').collection('books').deleteMany();
    // console.log('complete delete successful');
    res.send('complete delete successful');
    
    
    
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
    // console.log(typeof(bookid));
      // json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    
    try{
    db.db('test').collection('books').findOne({_id: ObjectId(bookid)},(err,result)=>{
      if (result == null){
        res.send('no book exists');
      }else{      
      res.json({"_id": result._id, "title": result.title, "comments": result.comments});
      // console.log(result);
      }
      })
    } catch (e) {
      if (e instanceof Error){
        res.send('no book exists');
      }
    }
    })
    
  
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    
    try{
    db.db('test').collection('books').findOne({_id: ObjectId(bookid)}, (err,result)=>{
      if(err){
        console.log('error');
      }else if(result == null){
        res.send('no book exists');
      }else if(comment == ''){
        res.send('You did not add a comment');
      }else{
        console.log(comment);
        db.db('test').collection('books').updateOne({_id: ObjectId(bookid)},{$push: {comments: comment}});
        db.db('test').collection('books').updateOne({_id: ObjectId(bookid)},{$inc: {commentcount: +1}});
        db.db('test').collection('books').findOne({_id: ObjectId(bookid)},(err,result)=>{
          res.json({"_id": result._id, "title": result.title, "comments": result.comments});// console.log(result);
      })
      }
    });
    } catch (e) {
      if (e instanceof Error){
        res.send('no book exists');
      }
    }
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    
    try{
        db.db('test').collection('books').findOne({_id: ObjectId(bookid)}, (err,result)=>{
          if (err) {
            console.log('error');
          }else if(result == null){
            res.send('no book exists');
          }else{
            db.db('test').collection('books').deleteOne({_id: ObjectId(bookid)});
            res.send('delete successful');
          }
        });
        } catch (e) {
          if (e instanceof Error){
            res.send('no book exists');
          }
        }
    });
  
};
