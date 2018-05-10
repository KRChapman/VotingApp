

let form = document.querySelector('.add-poll');

let drop = document.querySelector('.vote-dropdown');
//title
document.addEventListener('DOMContentLoaded', renderPage);
if(form){
  form.addEventListener('submit', submitEvent);
}

drop.addEventListener('change', voteOption)

function voteOption(e){
  e.preventDefault();
  let title = document.querySelector('.poll-name').textContent;
 // let title = document.querySelectorAll('.poll-name').textContent;

 let selected = this.options[this.selectedIndex].textContent;
  console.log("e target", selected);
  // title = encodeURIComponent(title);
  // selectedOption = encodeURIComponent(selectedOption);
  let url = `/voteupdate/${selected}?pollname=${title}`;
  fetch(url).then(response => response.json()).then(data => renderChartDropDown(data));
  //
}

function submitEvent(e){
  e.preventDefault();
  let title = document.querySelector('.poll-name').textContent;
  
  let addedOption = e.target[0].value;
  let url = `/addoption/${addedOption}?pollname=${title}`;
  fetch(url).then(response => response.json()).then(data => {
    console.log(data) 
    renderChartDropDown(data)
  });
  
}


function renderPage(e){
  // console.log("added", added);
  let title = document.querySelector('.poll-name');

  console.log(title.textContent);
  dataForChart(title.textContent)
}

function dataForChart(pollname){
  let url = `/api/polls/${pollname}`

  fetch(url).then(response =>response.json())
  .then(data => renderChartDropDown(data))
  .catch(error => console.log('err', error))
}

function renderChartDropDown(data){
  console.log(data);
 
  let optionsArray = [];
  let dataArray = [];
  data.forEach(element => {
    optionsArray.push(element.optionTitle);
    dataArray.push(element.Votes);
  });

  renderDrodown(optionsArray, dataArray);
  renderChart(optionsArray, dataArray);

}

function renderDrodown(optionsArray, dataArray){
  let dropdown = document.querySelector('.vote-dropdown');
  
  optionsArray.forEach((element, index) => {
    let title = element;
    let data = dataArray[index];
    //${title}
 
    dropdown.insertAdjacentHTML('afterbegin', `<option value=${data}>${title}</option>`);
  });
 
}


function renderChart(optionsArray, dataArray){


  var ctx = document.getElementById("myChart").getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: optionsArray,
      datasets: [{
        label: '# of Votes',
        data: dataArray,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {

      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      responsive: false,
      legend: {
        labels: {
          // This more specific font property overrides the global property
          fontColor: 'blue'
        }

      }

    }
  });
}