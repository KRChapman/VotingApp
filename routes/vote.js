const express = require('express'),
      router = express.Router(),
      { User } = require('./../models/users'),
      { Poll } = require('./../models/polls');

router.get('/:pollname', function goToPollPage(req, res) {
  const pollname = req.params.pollname;
  let pagename = `vote/${pollname}`;
  let username = req.session.username;
  Poll.isAddOptionFormVisible(username, pollname, function (err, user) {
    let validUser;
    if (err) {
      next(err);
    }
    else if (user) {
      validUser = user.userName;
    }
    else {
      validUser = user;
    }
    res.render('vote', { pagename: pagename, pollname: pollname, validUser, username});
  })
})

module.exports = router;