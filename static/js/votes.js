(function (window) {

  const canvasid = "myChart";
  let form = document.querySelector('.add-poll');
  let drop = document.querySelector('.vote-dropdown');
  document.addEventListener('DOMContentLoaded', renderPage);
  drop.addEventListener('change', voteOption)

  function renderPage() {
    if (form) {
      form.addEventListener('submit', submitEvent);
    }
    let title = document.querySelector('.poll-name');
    dataForChart(title.textContent)
  }

  function submitEvent(e) {
    e.preventDefault();
    let title = document.querySelector('.poll-name').textContent;

    let addedOption = e.target[0].value;

    let url = '/addoption'
    ///${addedOption}?pollname=${title}`;
    let reqData = returnReqDataForVote(addedOption, title);
    drop.options.length = 0;
    drop.innerHTML = ' <option value="" selected="selected">Vote Options:</option>';
     
    if (window.myChart != null) {
      let oldcanvasid = window.myChart.chart.ctx.canvas.id;
      if (canvasid == oldcanvasid) {
        window.myChart.destroy();
      }
    }
    
    document.querySelector('.option-input').value = "";    
    fetch(url, reqData).then(response => response.json()).then(data => {
      console.log(data)
      renderChartDropDown(data)
    });

  }

  function dataForChart(pollname) {
    let url = `/api/polls/${pollname}`;
  

    fetch(url).then(response => response.json())
      .then(data => renderChartDropDown(data))
      .catch(error => console.log('err', error))
  }

  function renderChartDropDown(data) {
    let optionsArray = [];
    let dataArray = [];
    data.forEach(element => {
      if (optionsArray.indexOf(element.optionTitle) === -1) {
        optionsArray.push(element.optionTitle);
      }
      dataArray.push(element.Votes);
    });

    renderDrodown(optionsArray, dataArray);
    renderChart(optionsArray, dataArray);
  }

  function renderDrodown(optionsArray, dataArray) {
    let dropdown = document.querySelector('.vote-dropdown');

    optionsArray.forEach((element, index) => {
      let title = element;
      let data = dataArray[index];
      dropdown.insertAdjacentHTML('afterbegin', `<option value=${data}>${title}</option>`);
    });
  }

  function voteOption(e) {
    e.preventDefault();
    let title = document.querySelector('.poll-name').textContent;
    let selected = this.options[this.selectedIndex].textContent;
    this.options.length = 0;
    this.innerHTML = ' <option value="" selected="selected">Vote Options:</option>'
    let url = '/voteupdate';
    let reqData = returnReqDataForVote(selected, title);
    if (window.myChart != null) {
      let oldcanvasid = window.myChart.chart.ctx.canvas.id;
      if (canvasid == oldcanvasid) {
        window.myChart.destroy();
      }
    }
    fetch(url, reqData).then(response => response.json()).then(data => renderChartDropDown(data));

  }

  function returnReqDataForVote(selected, title) {

    let pollBody = {
      selected,
      pollname: title
    }
    const pollBodyToSend = JSON.stringify(pollBody);
    let url = '/createpoll';
    let reqObj = {
      credentials: 'include',
      mode: 'cors',
      method: 'POST',
      body: pollBodyToSend,
      headers: { "Content-Type": "application/json" }
    }
    return reqObj;
  }


  function renderChart(optionsArray, dataArray) {

    let ctx = document.getElementById(canvasid).getContext('2d');

    window.myChart = new Chart(ctx, {
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
            fontColor: 'blue'
          }

        }

      }
    });
  }
})(this);

