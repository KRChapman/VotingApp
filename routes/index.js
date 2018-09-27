const express = require('express'),
      router = express.Router(),
      { User } = require('./../models/users'),
      { Poll } = require('./../models/polls');


router.get('/', (req, res) => {
  res.redirect('/home');
})

router.get('/home', function (req, res, next) {
  let host = req.get('host');
  let username = req.session.username;
  let http = req.protocol;

  let protocol = `${http}://`;
  Poll.find().exec((err, doc) => {
    let listArray = [];
    doc.forEach((element, index) => {
      let objPolls = {};
      let link = encodeURIComponent(`${doc[index].title}`);
      objPolls.link = `${protocol}${host}/vote/${link}`;
      objPolls.title = `${doc[index].title}`;
      // build string then push
      listArray.push(objPolls);
    });

    res.render('home', { pagename: 'home', username, listArray });

  })

});


router.get('/api/polls/:pollname', (req, res, next) => {
  let title = req.params.pollname;

  Poll.find({ title: title }).then((doc) => {

    res.json(doc[0].options);
  }, function (e) {
    next(e);
  })

})

router.post('/addoption', function (req, res, next) {
  //:addedOption
  let addedOption = req.body.selected;
  let optionObj = {
    Votes: 0,
    optionTitle: addedOption
  }
  let title = req.body.pollname;
  Poll.findOneAndUpdate({ title }, { $push: { options: optionObj } }, { new: true }, function (err, doc) {
    if (!err) {
      res.send(doc.options);
    }
    else {

      next(err);
    }
  })
})



router.post('/voteupdate', function (req, res, next) {
  ///:selected
  let selectedOption = req.body.selected;
  let title = req.body.pollname;

  //.lean()
  Poll.findOneAndUpdate({ title: title, 'options.optionTitle': selectedOption }, { $inc: { 'options.$.Votes': 1 } }, { new: true }).lean().exec((err, doc) => {

    res.json(doc.options);
  });
})



router.post('/mypolls', (req, res) => {
  let username = req.session.username;
  let bod = req.body;

  Poll.find({ userName: username }).then(doc => res.send(doc));
})

router.delete('/deletepoll', function (req, res) {

  let query = Poll.find().remove({ title: req.body.title, userName: req.body.userName })

  query.exec();
})

router.get('/logout', (req, res) => {
  if (req.session) {

    req.session.destroy(function (err) {

      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }

})



module.exports = router;