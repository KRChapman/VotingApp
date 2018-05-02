const mongoose = require('mongoose');
// let ObjectId = mongoose.Schema.Types.ObjectId;
// userId: ObjectId
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
 // https://stackoverflow.com/questions/37089695/define-array-of-objects-based-on-a-mongoose-schema
  userName: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },


});


let Poll = mongoose.model('Poll', PollSchema);
module.exports = { Poll };
