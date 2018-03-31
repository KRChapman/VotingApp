const express = require('express'),
  MongoClient = require('mongodb').MongoClient,
  bodyParser = require('body-parser'),
  assert = require('assert'),
  nunjucks = require('nunjucks');

app = express();
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use('/static', express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({ extended: true }));

let env = nunjucks.configure('views', {
  autoescape: true,
  express: app
});

MongoClient.connect('mongodb://localhost:27017/DATABASEEEEEHERE', function (err, client) {
  "use strict";

  assert.equal(null, err);

  let db = client.db('DATABASEEEEEHERE');
  var router = express.Router();




  router.get('/', function displayHome(req, res) {




    res.render('home');


  });


  // router.post('/', function(req,res){

  // })


  app.use('/', router);

  // Start the server listening
  var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Mongomart server listening on port %s.', port);
  });

});