const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let collection = 'Users';

let UserSchema = new mongoose.Schema( {
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 1,

  },

  password: {
    type: String,
    required: true,
    minlength: 1
  }
}, { collection});
//this middleware function runs each time UserSchema is called and creates a new user
// in this case it creates a hashed password then calls next to continue to next middleware
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

UserSchema.statics.authenticate = function (email, password, callback) {
  
  this.findOne({ email: email })
    .exec(function (err, user) {
     
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
   
      bcrypt.compare(password, user.password, function (err, result) {
      
        if (result === true) {
          return callback(null, user);
        } else {

          let errMessage = (err != null)? err : {message :'incorrect password'};
          return callback(errMessage);
        }
      })
    });
}

let User = mongoose.model(collection, UserSchema);
module.exports = {User};

