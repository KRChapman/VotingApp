const { mongoose } = require('./../db/mongoo'),
      { User } = require('./../models/users');

//SHARE CODE
// https://stackoverflow.com/questions/3225251/how-can-i-share-code-between-node-js-and-the-browser
let checkForError = (errorObj) => {
 
  let errorExist;
  for (const iterator in errorObj) {
    errorExist = (errorObj[iterator] === '' && errorExist != true) ? false : true;
  }

  return errorExist
}



module.exports = { checkForError};

