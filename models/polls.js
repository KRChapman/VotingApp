const mongoose = require('mongoose');
let collection = 'Polls';
let nestedOptions = new mongoose.Schema({
   optionTitle: {type: String},
  Votes: { type: Number, default: 0}
  })

let PollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true
  },
  options: [nestedOptions],
  userName: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },

});

PollSchema.statics.isAddOptionFormVisible = function (username, title, callback){

  this.findOne({ userName: username, title })
    .exec(function (err, user) {

      if (err) {
        return callback(err)
      }
      if (user){
        return callback(null, user);
      }
      else{
        return callback(null, user);
      }
    })
    
}


let Poll = mongoose.model('Poll', PollSchema);
module.exports = { Poll };
