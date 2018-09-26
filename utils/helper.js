const { mongoose } = require('./../db/mongoo'),
      { User } = require('./../models/users');

let checkForError = (errorObj) => {
 
  let errorExist;
  for (const iterator in errorObj) {
    errorExist = (errorObj[iterator] === '' && errorExist != true) ? false : true;
  }

  return errorExist
}



module.exports = { checkForError};

