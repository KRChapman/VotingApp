const express = require('express'),
      // cookieSession = require('cookie-session'),
      MongoClient = require('mongodb').MongoClient,
      bodyParser = require('body-parser'),
      assert = require('assert'),
      nunjucks = require('nunjucks'),
      {checkForError, 
      checkForAutherization} = require('./utils/helper.js'),
      // mongoose = require('mongoose');

      session = require('express-session'),
      MongoStore = require('connect-mongo')(session),
      formidable = require('formidable'),

      {User} = require('./models/users'),
      {Poll} = require('./models/polls'),
      {mongoose} = require('./db/mongoo'),

      url = require('url');

  
// console.log(User);
const port = process.env.PORT || 3000;
app = express();
let db = mongoose.connection;
// res.sendFile(__dirname + '/index.html');});
// app.get('/', function (req, res) {
//   res.sendFile(__dirname + '/index.html');
// });
// app.use(express.static(__dirname + 'public'));
// app.listen(3000);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(session({
  secret: 'work with hard on',
  resave: false,
  saveUninitialized: false,
  //put the session in the database with connect-mongo
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// ttl: 14 * 24 * 60 * 60 // = 14 days. Default




//use mostly i think?
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// can I use both?

app.use('/static', express.static(__dirname + '/static'));



// app.set('trust proxy', 1);


let env = nunjucks.configure('views', {
  autoescape: true,
  express: app
});

  var router = express.Router();
  app.use('/', router);


function requiresLogin(req, res, next) {

  if (req.session && req.session.userId) {
    return next();
  } else {
  // 
    // var err = new Error('You must be logged in to view this page.');
    // err.status = 401;
    res.redirect('/signup');
    // return next(err);
  }
}


 
  router.get('/', (req,res) =>{


  
     res.redirect('/home');
  
    // res.render('home', { pagename: 'home' });
  
    
  } )

  router.get('/home', function (req, res, next) {
   let host = req.get('host');
 
   //localhost:3000/home
  //  let username = (req.session.username == null) ? null : req.session.username;
    let username = req.session.username;
    let http = req.protocol;

    let protocol = `${http}://`;
    Poll.find().exec((err,doc) =>{
      let listArray = [];
      
      //insertAdjacentHtml
      doc.forEach((element,index) => {
        let objPolls = {};
        let link = encodeURIComponent(`${doc[index].title}`);
        objPolls.link = `${protocol }${ host }/vote/${link}`;
        objPolls.title =`${doc[index].title}`;
     // build string then push
        listArray.push(objPolls);
      });
      console.log(listArray)
      res.render('home', { pagename: 'home', username, listArray });

    })

    

  });





  router.get('/signup', (req, res) => {
    

    res.render('signup');

  });
  router.post('/signup', (req, res, next) => {
    const email = req.body.email;
    const username = req.body.username;
    const passwords = req.body.password;


    // const emailError = (email === '') ? 'email field is blank' : '';
    const usernameError = (username === '')? 'user name field is blank': '';
    const passwordError = (passwords[0] !== passwords[1] || 
                         passwords[0] == "" && passwords[1] == "")? 'Passwords do not match' : '';
    const errors = { usernameError, passwordError};

    let error = checkForError(errors);

  
    if (!error ){

      // let userData = {
      //   username,
      //   password: passwords[0]
      // }
      // User.create(userData, (error, user) =>{
      //   if (error){
      //        if(error.code === 11000){
      
      //         errors.usernameError = 'duplicate username'
      //         return res.render('signup', errors);
      //       }
      //     return next(error);
      //   } else {
      //     req.session.userId = user._id;
      //     res.render('home', { username });
      //     // return res.json(user);
      //   }
      // });

      //this way you could pass the object to a function before saving
      // or modify it in other ways before saving
      let userData = new User ({
        email,
        username,
        password: passwords[0]

      })
      userData.save().then((doc) => {

        req.session.username = doc.username;
        req.session.userId = doc._id;
       
        res.render('home', { username });
      }, e => {
        
        if(e.code === 11000){
          var e = new Error('duplicate username');
          e.status = 400;
      
          errors.usernameError = 'duplicate username'
          return res.render('signup', errors);
        }     
          return next(e);    
      });
      
    }
    else {
    
      res.render('signup', errors);
    }
  });




///////////////////////////////////////////////////
  router.get('/login', (req, res) => {

    res.render('login');
  });
  router.get('/login/:pagename', function goToCorrectPageAfterLogin (req, res) {
    let pagename = req.params.pagename;

    pagename = pagename === 'signup' ? 'home' : pagename;

    res.render('login', { pagename: pagename});
  });

  





 //needed for going from looking at vote to log in
  router.get('/login/vote/:pagename', (req, res) => {
    let pagename = req.params.pagename;
    pagename = 'vote/' + pagename;
 
   // ,{ pagename: pagename }
    res.render('login');
    //res.render('login');
  });///:pagename
  router.post('/login/:url(*)', (req, res) => {
    let pagename = req.params.url;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    // console.log("pagename post", pagename);
    let test = pagename === ('signup' || "") ? 'home' : pagename;
    
    // const passwordError = (passwords[0] !== passwords[1] ||
    //   passwords[0] == "" && passwords[1] == "") ? 'Passwords do not match' : '';
    const usernameError = (username === '') ? 'user name field is blank' : '';
 

    
    const errors = { usernameError};
    if (!checkForError(errors)) {
      let pagenameTest = '/' + test;
      
      User.authenticate(email, password, function (err, userDoc){
      
        if(err){
          errors.passwordError = err.message;
          res.render('login', errors);
        // return next(err);
        }
        else{
          
          req.session.userId = userDoc._id;
          req.session.username = userDoc.username;
    
          res.redirect(pagenameTest);
        }
     
      });

    }
    else {

      res.render('login', errors);
    }
  });

//////////////////////////////////////////////////////////////
  router.get('/vote/:pollname',function goToPollPage(req,res) {
    const pollname = req.params.pollname;
 //   console.log('first get', pollname);
    let pagename = `vote/${pollname}`;
    let username = req.session.username;
    let jsFile = 'vote'
    res.render('vote', { pagename: pagename, pollname: pollname, username, jsFile});

  })
router.get('/api/polls/:pollname', (req, res, next) => {
  let title = req.params.pollname;
 // let title = req.params.polls;

  Poll.find({ title: title}).then((doc) => {
  
    let pollObj = {

    }
    // for (const key in doc) {
    //   if (object.hasOwnProperty(key)) {
    //     pollObj.title = 
        
    //   }
    // }
//console.log("doc[0].options", doc[0].options);
    res.json(doc[0].options);
  }, function(e){
    console.log(`vote api ${e.message}`, e);
    next(e);
  })
 // 
})

router.get('/addoption/:addedOption', function(req,res,next){
  let addedOption = req.params.addedOption;
  let optionObj = {
    Votes: 0,
    optionTitle: addedOption
  }
  let title = req.query.pollname;
  Poll.findOneAndUpdate({ title }, { $push: { options: optionObj } }, {new: true}, function(err, doc){
     //ADD code TO TEST FOR test for duplicate option
    if(!err){
      res.send(doc.options);
      console.log(doc);
    }
    else{
     
      next(err);
    }
  })
})

router.get('/voteupdate/:selected', function(req, res, next) {
  let selectedOption = req.params.selected;
  let title = req.query.pollname;
 
  //.lean()
  Poll.findOneAndUpdate({ title: title, 'options.optionTitle': selectedOption }, { $inc: { 'options.$.Votes': 1 } }, { new: true }).lean().exec((err, doc) =>{
  
    res.json(doc.options);
  });
})

router.get('/createpoll', requiresLogin, (req, res, next) => {
//  requiresLogin(req, res, next);
  let jsFile = "createpoll";
  let username = req.session.username;
  res.render('createpoll', {username, jsFile});

});
router.post('/createpoll', (req, res)  => {

 let options = req.body.options;
  let userName = req.session.username;


  


    let userPoll = new Poll({
      title: req.body.title,
      userName
    });
   
    options.forEach(element => {
      userPoll.options.push({ optionTitle: element })
    });
    
    userPoll.save().then(doc => {
     
      let resObj ={
        title: doc.title,  //req.body.title,
        userName
      }

      res.send(resObj);
      // res.json(linkToPoll)
    }, e => console.log(e))
 




})


router.post('/mypolls', (req, res) =>{
  let username = req.session.username;
  let bod = req.body;
  // console.log(username);
  // console.log(bod);

  Poll.find({ userName: username}).then(doc => res.send(doc));
})

router.delete('/deletepoll', function(req, res){

  let query = Poll.find().remove({ title: req.body.title, userName: req.body.userName })

  query.exec();
})

router.get('/logout', (req, res) => {
  if (req.session) {

    req.session.destroy(function (err) {
      console.log("err", err);
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }

})

//app.use('/createpoll', requiresLogin);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
 
  res.status(err.status || 500).send(err.message);

});



     //for testing with nodemon it tries to connect more than once while testing
  // if (!module.parent) {
 
   
 
  // }

  
app.listen(port);
console.log('server listening on port %s.', port);

// app.set('port', (process.env.PORT || 3000));

// // Start node server
// app.listen(app.get('port'), function () {
//   console.log('Node server is running on port ' + app.get('port'));
// });

