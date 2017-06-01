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

var petResults = [];

app.listen( 4555, function(){
  console.log('server 4555');
});

app.get('/', function(req, res){
  console.log('URL hit');
  res.sendFile( path.resolve( 'view/index.html' ) );
});

app.get('/pets', function(req, res){
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
        res.send(petResults)
      });
    }
  });
});
