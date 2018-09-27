const express = require('express'),
      router = express.Router(),
      {User} = require('./../models/users'),
      {Poll} = require('./../models/polls');

router.get('/', requiresLogin, (req, res, next) => {


  let username = req.session.username;
  res.render('createpoll', {username});

});
router.post('/', (req, res, next)  => {

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
      title: doc.title, 
      userName
    }
    console.log("resObjresObj", resObj);
    res.send(resObj);
  }, error => {

    res.send(error);

  })
 
})

function requiresLogin(req, res, next) {

  if (req.session && req.session.userId) {
    return next();
  } else {
    res.redirect('/signup');
  }
}




module.exports = router;