const { mongoose } = require('./../db/mongoo'),
      { User } = require('./../models/users');


let checkForError = (errorObj) => {
 
  let errorExist;
  for (const iterator in errorObj) {
    errorExist = (errorObj[iterator] === '' && errorExist != true) ? false : true;
  }

  return errorExist
}


let checkForAutherization = (sessionObj) => {
  //req.sessionID
  console.log("sessionObj.id", sessionObj.id);
  console.log("sessionObj.userId", sessionObj.userId);
  //USE PROMISES
  // Session.findOne({})
 
}

module.exports = { checkForError, checkForAutherization};

