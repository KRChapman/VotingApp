const expect = require('expect');

const utils = require('./helper');

let m = 'user name field is blank';

const datas = [{args: {usernameError: '', passwordError: ''}, result: false },
  { args: { usernameError: m, passwordError: '' }, result: true }, 
  { args: { usernameError: '', passwordError: 'i am an error' }, result: true }];


  datas.forEach(data =>{
    let d = JSON.stringify(data.args, null, 2)
    it(`${d} should be ${data.result}`, () => {


      let res = utils.checkForError(data.args);
      expect(res).toBe(data.result);
    });


  })
