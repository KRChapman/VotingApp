const { mongoose } = require('./../db/mongoo');


let checkForError = (errorObj) => {
  //  console.log("errorObj", errorObj)
  let errorExist;
  for (const iterator in errorObj) {
    //console.log("iterator", errorObj[iterator]);
    errorExist = (errorObj[iterator] === '' && errorExist != true) ? false : true;
    //console.log("errorExist", errorObj[iterator]);
  }

  return errorExist
}


let checkForAutherization = () => {
  
}

module.exports = { checkForError, checkForAutherization};

