let optionsBtn = document.querySelector(".options-button");
let pollForm = document.querySelector(".create-poll");
let ul = document.querySelector("ul");
// let fragment = new DocumentFragment()
let string = '<label for="options">Option:</label>' + '<input type= "text" name="options" class= "option-input">';

// let current = window.location.href;
// console.log(a);

let expandingList = document.createElement('li')
expandingList.innerHTML = string;
optionsBtn.addEventListener('click', function (e) {
  e.preventDefault();
  ul.insertAdjacentHTML("beforeend",string);
 // ul.appendChild(expandingList);

})




pollForm.addEventListener('submit', function (e) {
  e.preventDefault();
 
 console.log(e);

  let sendPosts = document.querySelectorAll('.option-input')



  // 
  // let sendPostsArrays = [];
  // sendPostsArrays = sendPosts.map(element =>{
  //   sendPostsArray.push(element);
  //   return sendPostsArray[]element.value;
  // })
  let sendPostsArray = [];
  for (let i = 0; i < sendPosts.length; i++) {
    sendPostsArray.push(sendPosts[i].value)
    
  }
  let sendPostBody = {
    title: e.target[0].value,
   options: sendPostsArray
  }
 let a = JSON.stringify(sendPostBody);


  let url = '/createpoll';

  let reqObj = {
  
    // no-cors header option chabges are limited
    // need cors for changing headers
    mode: 'cors',
    method: 'POST',
    body: a,
    headers: { "Content-Type": "application/json" } 
    
  }

  fetch(url, reqObj).then(response => response.text()).then(data => {

    console.log(data);


  })


 
})


