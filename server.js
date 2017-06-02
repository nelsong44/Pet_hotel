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
app.use( express.static( 'public' ) );
app.use( bodyParser.urlencoded( { extended: true } ) );

app.listen( 4555, function(){
  console.log('server 4555');
});

app.get('/', function(req, res){
  console.log('URL hit');
  res.sendFile( path.resolve( 'view/index.html' ) );
});

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
      var petData = connection.query('SELECT * FROM petData');

      petData.on( 'row', function(row){
        petResults.push(row);
      });
      petData.on( 'end', function(){
        done();
        res.send(petResults);
      });
    }
  });
});

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
    }
  });
});

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
    }
    });
  });

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
      }
  });
});
