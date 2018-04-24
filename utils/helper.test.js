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

/* 
suite("my test suite", function () {
  var data = ["foo", "bar", "buzz"];
  var testWithData = function (dataItem) {
    return function () {
      console.log(dataItem);
      //Here do your test.
    };
  };

  data.forEach(function (dataItem) {
    test("data_provider test", testWithData(dataItem));
  });
}); */