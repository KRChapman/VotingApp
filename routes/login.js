const express = require('express'),
      router = express.Router(),
      {checkForError} = require('./../utils/helper.js'),
      { User } = require('./../models/users'),
      { Poll } = require('./../models/polls');



router.get('/', (req, res) => {

  res.render('login');
});
router.get('/:pagename', function goToCorrectPageAfterLogin(req, res) {
  let pagename = req.params.pagename;

  pagename = pagename === 'signup' ? 'home' : pagename;

  res.render('login', { pagename: pagename });
});


//needed for going from looking at vote to log in
router.get('/vote/:pagename', (req, res) => {
  let pagename = req.params.pagename;
  pagename = 'vote/' + pagename;


  res.render('login');

});
router.post('/:url(*)', (req, res) => {
  let pagename = req.params.url;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  let redirect = pagename === ('signup' || "") ? 'home' : pagename;

  const usernameError = (username === '') ? 'user name field is blank' : '';
  const errors = { usernameError };

  if (!checkForError(errors)) {
    let pagenameRedirect= '/' + redirect;

    User.authenticate(email, password, function (err, userDoc) {

      if (err) {
        errors.passwordError = err.message;
        res.render('login', errors);
        // return next(err);
      }
      else {
        req.session.userId = userDoc._id;
        req.session.username = userDoc.username;

        res.redirect(pagenameRedirect);
      }

    });

  }
  else {

    res.render('login', errors);
  }
});


module.exports = router;