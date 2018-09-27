const express = require('express'),
      bodyParser = require('body-parser'),
      assert = require('assert'),
      nunjucks = require('nunjucks'),
      
      session = require('express-session'),
      MongoStore = require('connect-mongo')(session),
      signupRouter = require('./routes/signup'),
      loginRouter = require('./routes/login'),
      voteRouter = require('./routes/vote'),
      createpollRouter = require('./routes/createpoll'),
      router = require('./routes/index'),
      {mongoose} = require('./db/mongoo');



app = express();
let db = mongoose.connection;

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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/static', express.static(__dirname + '/static'));

let env = nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/vote', voteRouter);
app.use('/createpoll', createpollRouter);
app.use('/', router);


app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
 
  res.status(err.status || 500).send(err.message);

});


module.exports = app;

