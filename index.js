const express = require('express'),
  MongoClient = require('mongodb').MongoClient,
  bodyParser = require('body-parser'),
  assert = require('assert'),
  nunjucks = require('nunjucks');

app = express();
// res.sendFile(__dirname + '/index.html');});
// app.get('/', function (req, res) {
//   res.sendFile(__dirname + '/index.html');
// });
// app.use(express.static(__dirname + 'public'));
// app.listen(3000);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static(__dirname + '/static'));
const a = '1';
console.log(a);
let env = nunjucks.configure('views', {
  autoescape: true,
  express: app
});

MongoClient.connect('mongodb://localhost:27017/DATABASEEEEEHERE', function (err, client) {
  "use strict";

  assert.equal(null, err);

  let db = client.db('DATABASEEEEEHERE');
  var router = express.Router();

  let checkForError = (errorObj) => {
  //  console.log("errorObj", errorObj)
    let errorExist;
    for (const iterator in errorObj) {
      //console.log("iterator", errorObj[iterator]);
      errorExist = (errorObj[iterator] === '' && errorExist != true) ? false : true;
      //console.log("errorExist", errorObj[iterator]);
    }
    return errorExist
  }


  router.get('/home', function displayHome(req, res) {

    res.render('home', {pagename: 'home'});

  });





  router.get('/signup', (req, res) => {
    res.render('signup');

  });
  router.post('/signup', (req, res) => {
    const username = req.body.username;
    const passwords = req.body.password;

    const usernameError = (username === '')? 'user name field is blank': '';
    const passwordError = (passwords[0] !== passwords[1] || 
                         passwords[0] == "" && passwords[1] == "")? 'Passwords do not match' : '';
    const errors = { usernameError, passwordError};

    let a = checkForError(errors);
    console.log('sign1', a)
    if (!a ){
      console.log('sign2', a)
      res.render('home', {username});
    }
    else {
      console.log('sign3', a)
      res.render('signup', errors);
    }
  });




///////////////////////////////////////////////////
  router.get('/login', (req, res) => {

    res.render('login');
  });
  router.get('/login/:pagename', (req, res) => {
    let pagename = req.params.pagename;

    pagename = pagename === 'signup' ? 'home' : pagename;

    res.render('login', { pagename: pagename});
  });

 //needed for going from looking at vote to log in
  router.get('/login/vote/:pagename', (req, res) => {
    let pagename = req.params.pagename;
    pagename = 'vote/' + pagename;
    console.log('/voat/:pagename', pagename);
   // ,{ pagename: pagename }
    res.render('login');
    //res.render('login');
  });///:pagename
  router.post('/login/:url(*)', (req, res) => {
    let pagename = req.params.url;
    const username = req.body.username;
    const password = req.body.password;
    // console.log("pagename post", pagename);
    let test = pagename === ('signup' || "") ? 'home' : pagename;
    const usernameError = (username === '') ? 'user name field is blank' : '';
    // const passwordError = (passwords[0] !== passwords[1] ||
    //   passwords[0] == "" && passwords[1] == "") ? 'Passwords do not match' : '';

    let passwordError = "";// look in db for pass return error if not found
    const errors = { usernameError, passwordError };
    if (!checkForError(errors)) {
      pagename = '/' + pagename;
      res.redirect(pagename);
    }
    else {
      console.log('login', a);
      res.render('login', errors);
    }



  });

//////////////////////////////////////////////////////////////
  router.get('/vote/:pollname',(req,res) => {
    const pollname = req.params.pollname;
    let pagename = `vote/${pollname}`;
    res.render('vote', { pagename: pagename, pollname: pollname});

  })

  router.get('/createpoll', (req, res) => {

    res.render('createpoll');

  })

  app.use('/', router);

  // Start the server listening
  var serve = app.listen(3000, function () {
   var port = serve.address().port;

    console.log('Mongomart server listening on port %s.', port);
  });

});


