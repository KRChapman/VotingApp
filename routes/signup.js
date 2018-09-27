const express = require('express'),
      router = express.Router(),
      {checkForError} = require('./../utils/helper.js'),
      { User } = require('./../models/users');



router.get('/', (req, res) => {


  res.render('signup');

});
router.post('/', (req, res, next) => {
  const email = req.body.email;
  const username = req.body.username;
  const passwords = req.body.password;

  const usernameError = (username === '') ? 'user name field is blank' : '';
  const passwordError = (passwords[0] !== passwords[1] ||
    passwords[0] == "" && passwords[1] == "") ? 'Passwords do not match' : '';
  const errors = { usernameError, passwordError };

  let error = checkForError(errors);


  if (!error) {

    //this way you could pass the object to a function before saving
    // or modify it in other ways before saving
    let userData = new User({
      email,
      username,
      password: passwords[0]

    })
    userData.save().then((doc) => {

      req.session.username = doc.username;
      req.session.userId = doc._id;

      res.redirect('/home');
    }, e => {

      if (e.code === 11000) {
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


module.exports = router;