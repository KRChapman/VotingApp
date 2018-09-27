
(function (window) {

  let optionsBtn = document.querySelector(".options-button");
  let pollForm = document.querySelector(".create-poll");
  let ul = document.querySelector("ul");
  let string = '<label for="options">Option: </label>' + '<input type= "text" name="options" class= "option-input">';

  optionsBtn.addEventListener('click', function (e) {
    e.preventDefault();
    let expandingList = document.createElement('li')
    expandingList.innerHTML = string;
    ul.insertAdjacentElement("beforeend", expandingList);
  })

  pollForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let sendPosts = document.querySelectorAll('.option-input');
    const title = e.target[0].value;
    let url = '/createpoll';
    let sendPostsArray = [];
    let isBlank = false;
    for (let i = 0; i < sendPosts.length; i++) {
      if (sendPosts[i].value === '') {
        isBlank = true;
      }
      sendPostsArray.push(sendPosts[i].value)
    }    
    const reqData = createRequestData(title, sendPostsArray);
    if (isBlank) {
      displayBlankError();
    } else {
      createShareLink(url, reqData);
    }

  })

  function createShareLink(url, reqObj) {
    fetch(url, reqObj).then(response => response.json()).then(data => {
      if (createPollError(data)){
        document.querySelector(".createpoll-error").textContent = "poll name already exists"
      }
      else{
        let formDiv = document.querySelector('.form-container');
        let form = document.querySelector('.create-poll');
        let pollTitle = document.querySelector(".poll-title");
        let divBlock = document.createElement('div');
        divBlock.classList.add("poll-link");
        let link = document.createElement('a');
        let index = window.location.href.indexOf(window.location.pathname);
        let startOfLinkHost = window.location.href.substring(0, index);
        let dataLink = `${startOfLinkHost}/vote/${data.title}?username=${data.userName}`;
        link.textContent = dataLink;
        link.setAttribute('href', dataLink);
        divBlock.appendChild(link);
        pollTitle.textContent = "Link to share for this poll";
        let replacedNode = formDiv.replaceChild(divBlock, form);
        document.querySelector(".createpoll-error").textContent = ""

      } 

    }).catch(error => {
      console.log("error errorerror", error);
    })
  }

  function displayBlankError() {

    let form = document.querySelector('.create-poll');
    let divBlock = document.createElement('div');
    divBlock.textContent = "Fill out Blank option";
    form.insertAdjacentElement('beforeend', divBlock)
  }

  function createRequestData(title, options){
    let sendPostBody = {
      title,
      options
    }
    const pollLabelsBody = JSON.stringify(sendPostBody);
    let url = '/createpoll';
    let reqObj = {
      // needed for cors to send cookies
      credentials: 'include',
      // no-cors header option are limited
      // need cors for changing headers
      mode: 'cors',
      method: 'POST',
      body: pollLabelsBody,
      headers: { "Content-Type": "application/json" }
    }

    return reqObj;
  }

  function createPollError(data){
    let error = false;
    if (!data.title || !data.userName){
      error = true;
    }
    return error;
  }

})(this);




