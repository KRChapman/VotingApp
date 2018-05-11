var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/VotingApp', function (error) {
  if (error) {
    console.log("error", error);
  }
})
// mongoose.connect('mongodb://localhost:27017/VotingApp');

module.exports = {mongoose};
