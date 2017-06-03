// requires
var express = require( 'express' );
var app = express();
var path = require( 'path' );
var bodyParser = require( 'body-parser' );
var pg = require('pg');
var config = {
  database: 'omega',
  host: 'localhost',
  port: 5432,
  max: 12
};
var pool = new pg.Pool( config );

// uses
app.use( express.static( 'public' ) );
app.use( bodyParser.urlencoded( { extended: true } ) );

// listen
app.listen( 4555, function(){
  console.log('server 4555');
});

// base url
app.get('/', function(req, res){
  console.log('URL hit');
  res.sendFile( path.resolve( 'view/index.html' ) );
});

// requests
app.get('/pets', function(req, res){
  var petResults = [];
  console.log('URL hit');
  pool.connect( function( err , connection , done ){
    if (err){
      console.log('error in connection', err);
      done();
      res.send( 400 );
    }
    else {
      //retireve pet info from db
      var petData = connection.query('SELECT * FROM petData');
      // push info from db into array
      petData.on( 'row', function(row){
        petResults.push(row);
      }); // end push
      petData.on( 'end', function(){
        done();
        res.send(petResults);
      }); // end
    } // end if statement
  }); // end pool connect
}); // end get

// requset to send pet info to db
app.post('/pets', function(req, res){
  console.log(req.body);
  var data = req.body;
  var first = data.firstname;
  var last = data.lastname;
  pool.connect( function( err , connection , done ){
    if (err){
      console.log('error in connection', err);
      done();
      res.send( 400 );
      }
    else {
      var ownerInfo = connection.query("INSERT INTO petData (firstName, lastName) Values ('" + first + "', '" + last + "' )");
      console.log(ownerInfo);
      done();
      res.send('success');
    } // end if statement
  }); // end pool connect
}); // end post

// request to update pet info in db
app.post('/petAdd', function(req, res){
  console.log(req.body);
  var data = req.body;
  var first = data.first;
  var last = data.last;
  pool.connect( function( err , connection , done ){
    if (err){
      console.log('error in connection', err);
      done();
      res.send( 400 );
      }
    else {
      var updateRegistry = connection.query("UPDATE petData SET petname = '" + data.pet + "', " +
            "breed = '" + data.breed + "', color = '" + data.color + "' WHERE lastname = '" + last +
            "' AND firstname = '" + first + "';");
      console.log('Registry Updated');
      done();
      res.send('success');
    } // end if statement
  }); // end pool connect
}); // end post

// request to delete pet info from db
app.delete('/pet', function(req, res){
  pool.connect( function( err , connection , done ){
    if (err){
      console.log('error in connection', err);
      done();
      res.send( 400 );
      }
    else {
      console.log(req.body);
      var owner = (req.body.owner).split(' ');
      console.log(owner);
      var first = owner[0];
      var last = owner[1];
      var pet = req.body.pet;
      var deleteRegistry = connection.query("DELETE FROM petData WHERE (firstname = '" + first + "') AND" +
      "(lastname = '" + last + "') AND (petname = '" + pet + "')");
      res.send('successful delete');
    } // end if statement
  }); // end pool connect
}); // end delete
