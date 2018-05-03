

let myPollsBtn = document.querySelector('.mypolls-btn');

if (myPollsBtn !=  null){
  myPollsBtn.addEventListener('click', showMyPolls);
}



function showMyPolls(){
  let url = '/mypolls';

  let postBody = {
    test: 'hi'
  }
  let jsonData = JSON.stringify(postBody);

  let reqObj = {
    credentials: 'include',
    //cors: "no-cors",
    cors: 'cors',
    method: 'POST',
    body: jsonData,
    headers: { "Content-Type": "application/json" }
   // { 'Content-type': 'text/plain' }
  }

 
  fetch(url, reqObj).then(response => response.json()).then(data =>{

    renderMyPoll(data);

  
     let tableRows = document.querySelectorAll("tr");

     document.querySelectorAll(".delete-btn").forEach(function(element, index){
       element.index = index;
     
       element.username = data[index].userName;
       element.table = tableRows;

       // probably not best becaue it relies on order of database staying the same
       // prob would be better to get text cotent this.table[this.index + 1].textContent)
       element.title = data[index].title;
       // search for first | with index of then cut out rest

       element.addEventListener('click', removeRow);

     })
  
  })

}
function removeRow() {
  //the element is passed in with all its properties added from above
  console.log('this', this.title);
  console.log('this text', this.table[this.index + 1].textContent);
  
  let url = '/deletepoll'
  let postBody = {
    title: this.title,
     userName: this.username 
  }
  let jsonData = JSON.stringify(postBody);

  let reqObj = {
    credentials: 'include',
    //cors: "no-cors",
    cors: 'cors',
    method: 'DELETE',
    body: jsonData,
    headers: { "Content-Type": "application/json" }
  
  }

  fetch(url, reqObj);




  this.table[this.index + 1].remove();

}


function renderMyPoll(data){
  let divContainer = document.querySelector('.content-container');
  let divMyPoll = document.querySelector('.mypolls');

  let newDiv = document.createElement('div');
  let table = document.createElement('table');
  newDiv.classList.add("mypolls");

  // create table structure dynamicly with data from fetch api call to database
  //then add new table elements as child to new created table elements
  let elementsObj = createTableHeadAndData(data);
  table.insertAdjacentElement('beforeend', elementsObj.tableHead);
 
  //elemetns object contains table data to be attached to new created table
  elementsObj.tableData.forEach(element => {
    table.insertAdjacentElement('beforeend', element);
  });

  newDiv.appendChild(table);

  let replacedNode = divContainer.replaceChild(newDiv, divMyPoll);

}


function createTableHeadAndData(data){

  let tableRowHead = document.createElement('tr');
  tableRowHead.insertAdjacentHTML('afterbegin', `<th></th><th>Poll Name</th><th>Options</th>`);
  let elementsArray = [];
  //iterate over data to create a row for each element in data then create td for each option in options array
  for (let i = 0; i < data.length; i++) {
    var tableRowData = document.createElement('tr');
    var longString = "<td>"; 
    let link = linkToPoll(data[i]);
    tableRowData.insertAdjacentHTML('beforeend', `<td><button class="delete-btn">Delete</button></td>`);
    tableRowData.insertAdjacentHTML('beforeend', `<td><a href=${link}>${data[i].title}</a></td>`);
    
    
  
    for (let j = 0; j < data[i].options.length; j++) { 
      longString += ` | ${data[i].options[j].optionTitle} Votes: ${data[i].options[j].Votes}`
      
    }
    tableRowData.insertAdjacentHTML('beforeend', longString + '</td>');
    elementsArray.push(tableRowData);
    tableRowData = null;
    longString = null;
  }
  //console.log(elementsArray);
  let elementsObj = {
    tableHead: tableRowHead,
    tableData: elementsArray
  }
  return elementsObj;
  // tableRowData.insertAdjacentElement('beforeend', tableRowData);
}

function linkToPoll (data){
  
  let index = window.location.href.indexOf(window.location.pathname);
  let startOfLinkHost = window.location.href.substring(0, index);
  // console.log("startOfLinkHost", startOfLinkHost);
  let title = encodeURIComponent(data.title) 
  let dataLink = `${startOfLinkHost}/vote/${title}?username=${data.userName}`;


  return dataLink;
}



