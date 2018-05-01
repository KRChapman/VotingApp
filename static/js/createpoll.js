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
    credentials: 'include',
    // no-cors header option chabges are limited
    // need cors for changing headers
    mode: 'cors',
    method: 'POST',
    body: a,
    headers: { "Content-Type": "application/json" } 
    
  }
                                              //or text
  fetch(url, reqObj).then(response => response.json()).then(data => {
    let formDiv = document.querySelector('.form-container');
    let form = document.querySelector('.create-poll');
    let pollTitle = document.querySelector(".poll-title");

    let divBlock = document.createElement('div');
    divBlock.classList.add("poll-link");

    let link = document.createElement('a');

                //entire link               //   /createpoll
    let index = window.location.href.indexOf(window.location.pathname);
    let startOfLinkHost = window.location.href.substring(0, index);
    console.log("startOfLinkHost", startOfLinkHost);

    let dataLink = `${startOfLinkHost}/vote/${data.pollName}?username=${data.userName}`;
    console.log("startOfLinkHost", dataLink);
    link.textContent = dataLink;
    link.setAttribute('href', dataLink);

    divBlock.appendChild(link);

   
    pollTitle.textContent = "Poll Link"
    let replacedNode = formDiv.replaceChild(divBlock, form);
    console.log(data.userId);


  })


 
})


