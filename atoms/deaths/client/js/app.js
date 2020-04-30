import * as d3 from 'd3'
import { numberWithCommas, getDataUrlForEnvironment, beautyTimestamp } from 'shared/js/util'
import $ from 'shared/js/util'



let isMobile = window.matchMedia('(max-width: 400px)').matches;
let isTablet = window.matchMedia('(max-width: 700px)').matches;
let isDesktop = window.matchMedia('(max-width: 900px)').matches;
let isWide = window.matchMedia('(max-width: 1300px)').matches;

const atomEl = d3.select('.interactive-wrapper').node();

var showButton = document.getElementById('button-show-more')
var stateTable = d3.select('.charts-container').node();

var status = 'more';

showButton.addEventListener('click', f => {
	console.log('clicked')
    if (status == 'more') {
      stateTable.classList.add('show-full');
    } else {
      stateTable.classList.remove('show-full');
    }
    showButton.classList.remove(status);
    status = (status === 'more' ? 'fewer' : 'more');
    showButton.classList.add(status);
    document.querySelector('#button-show-more .text').textContent = 'Show ' + status;

    window.resize()
})

let width = atomEl.getBoundingClientRect().width;

console.log(width)

const parseTime = d3.timeParse("%m/%d/%y");

let dates;

let datesJS;

let startEndDates;

let places = [];

let chartW;

if(width < 400)chartW = width;
if(width >= 400 && width < 900)chartW = (width / 3) - 5;
if(width >= 900)chartW = (width / 4) - 5;

console.log(chartW)

  
let chartH = chartW * .4;
  
let marginBottom = chartH - 20;

let xScale = d3.scaleTime()
.range([0, chartW])


let yScale = d3.scaleLinear()
.range([chartH - 20, 1])

let line = d3.line()
.x(d => xScale(parseTime(d.date)))
.y(d => yScale(d.weekly))
.curve(d3.curveCardinal)

let area = d3.area()
.x(d => xScale(parseTime(d.date)))
.y0(d => yScale(d.new))
.y1(chartH - 20)
.curve(d3.curveStepBefore)

d3.csv('https://interactive.guim.co.uk/2020/coronavirus-jh-timeline-data/time_series_covid19_deaths_global.csv')
.then(casesRaw => {

	dates = Object.entries(casesRaw[0]).slice(4, casesRaw[0].length).map( e => e[0]);

	datesJS = Object.entries(casesRaw[0]).slice(4, casesRaw[0].length).map( e => parseTime(e[0]));

	startEndDates = d3.extent(datesJS);

	xScale.domain(startEndDates)

  	const canada = casesRaw.filter(place => place["Country/Region"] === 'Canada');
  
  	let canadaRaw = { country:'Canada', cases: []};
  
  	let canadaSum = dates.map((date,i) => {
    
	    let sumByDatePrev;

	    if(i>0)
	    {
	      sumByDatePrev = d3.sum(canada, d => d[dates[i-1]])
	    }
	    
	    let sumByDate = d3.sum(canada, d => d[date])
	    	canadaRaw.cases.push({date: date, acum: sumByDate, new: i == 0 ? sumByDate : sumByDate - sumByDatePrev, weekly:0})
  	})
  
	const australia = casesRaw.filter(place => place["Country/Region"] === 'Australia');
	  
	let australiaRaw = { country:'Australia', cases: []};
	  
	let AustraliaSum = dates.map((date,i) => {
	    
		let sumByDatePrev;

		if(i>0)
		{
			sumByDatePrev = d3.sum(australia, d => d[dates[i-1]])
		}
		    
		let sumByDate = d3.sum(australia, d => d[date])
			australiaRaw.cases.push({date: date, acum: sumByDate, new: i == 0 ? sumByDate : sumByDate - sumByDatePrev, weekly:0})
	})
  
  	const china = casesRaw.filter(place => place["Country/Region"] === 'China');
  
  	let chinaRaw = { country:'China', cases: []};
  
  	let chinaSum = dates.map((date,i) => {
    
    	let sumByDatePrev;
	    if(i>0)
	    {
	      sumByDatePrev = d3.sum(china, d => d[dates[i-1]])
	    }
	    
	    let sumByDate = d3.sum(china, d => d[date])
	    	chinaRaw.cases.push({date: date, acum: sumByDate, new: i == 0 ? sumByDate : sumByDate - sumByDatePrev, weekly:0})
  	})
  
  	const uk = casesRaw.filter(place => place["Country/Region"] === 'United Kingdom');
  
  	let ukRaw = { country:'United Kingdom', cases: []};
  
  	let ukSum = dates.map((date,i) => {
    
	    let sumByDatePrev;

	    if(i>0)
	    {
	      sumByDatePrev = d3.sum(uk, d => d[dates[i-1]])
	    }
	    
	    let sumByDate = d3.sum(uk, d => d[date])
	    	ukRaw.cases.push({date: date, acum: sumByDate, new: i == 0 ? sumByDate : sumByDate - sumByDatePrev, weekly:0})
  	})

  	const france = casesRaw.filter(place => place["Country/Region"] === 'France');
  
  	let franceRaw = { country:'France', cases: []};
  
  	let franceSum = dates.map((date,i) => {
    
	    let sumByDatePrev;

	    if(i>0)
	    {
	      sumByDatePrev = d3.sum(france, d => d[dates[i-1]])
	    }
	    
	    let sumByDate = d3.sum(france, d => d[date])
	    	franceRaw.cases.push({date: date, acum: sumByDate, new: i == 0 ? sumByDate : sumByDate - sumByDatePrev, weekly:0})
  	})

  	const netherlands = casesRaw.filter(place => place["Country/Region"] === 'Netherlands');
  
  	let netherlandsRaw = { country:'Netherlands', cases: []};
  
  	let netherlandsSum = dates.map((date,i) => {
    
	    let sumByDatePrev;

	    if(i>0)
	    {
	      sumByDatePrev = d3.sum(netherlands, d => d[dates[i-1]])
	    }
	    
	    let sumByDate = d3.sum(netherlands, d => d[date])
	    	netherlandsRaw.cases.push({date: date, acum: sumByDate, new: i == 0 ? sumByDate : sumByDate - sumByDatePrev, weekly:0})
  	})
  
  
  
	casesRaw
	  .filter(place => place['Country/Region'] != 'Canada')
	  .filter(place => place['Country/Region'] != 'Australia')
	  .filter(place => place['Country/Region'] != 'China')
	  .filter(place => place['Country/Region'] != 'United Kingdom')
	  .filter(place => place['Country/Region'] != 'France')
	  .filter(place => place['Country/Region'] != 'Netherlands')
	  .map((p,i) => {
	    
	    places.push({province:p['Province/State'], country:p['Country/Region'], lat:p.Lat, lon:p.Long, cases:[]})
	    
	    dates.map((d,j) => places[i].cases.push({date: d, acum: +p[d], new: j == 0 ? +p[d] : p[d] - p[dates[j-1]] ,weekly:0}))
	  })
  
  
	 places.push(canadaRaw)
	 places.push(australiaRaw)
	 places.push(chinaRaw)
	 places.push(ukRaw)
	 places.push(franceRaw)
	 places.push(netherlandsRaw)

  
  
	  places.map( p => {

	    p.cases.map((c,i) => {
	    
	      const data = p.cases.slice(i,i+7);

	      c.weekly = d3.sum(data , s => s.new) / data.length;
	    
	    })
	  })


	  places.sort((a,b) => (d3.max(b.cases, d => d.weekly)) - (d3.max(a.cases, d => d.weekly)))

	  places.map( con => {

	  	makeChart(con)

	  })


	  window.resize();

})


const makeChart = (con) =>{

   
      let div = d3.select(".charts-container").append('div')
      .attr('class', 'gv-chart-wrapper')

      let head = div.append("h3")
      .html(con.country)

      let totalText = div.append("p")
      .html( numberWithCommas(d3.max(con.cases, d => d.acum)) + ' confirmed cases')

      let avg = d3.sum(con.cases.slice(con.cases.length - 7, con.cases.length), d => d.new) / 7;

      let avgText = div.append("p")
      .html('Week average: ' + numberWithCommas(avg.toFixed(1)))

      let svg = div.append("svg")
      .attr('id', 'gv-deaths-chart-' + con.country)
      .attr("viewBox", [0, 0, chartW, chartH]);

      yScale.domain([0, d3.max(con.cases, d => d.weekly)])

      let midPoint = +d3.format(".2r")(d3.max(con.cases, d => d.weekly) / 2);

      let midLine = d3.line()([[0,yScale(midPoint)], [chartW, yScale(midPoint)]])

      let baseLine = d3.line()([[0,yScale(0)], [chartW, yScale(0)]])

      const yAxis = svg.append("g")

      yAxis
      .append('path')
      .attr('d', midLine)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '1,2')
      .attr('stroke', 'black')
      .attr('fill', 'none')

      yAxis
      .append('path')
      .attr('d', baseLine)
      .attr('stroke-width', 1)
      .attr('stroke', 'black')
      .attr('fill', 'none')

      yAxis
      .append('text')
      .text(numberWithCommas(midPoint))
      .attr('transform', 'translate(0,' + (yScale(midPoint) - 5) + ')')
      .attr('midtext')
      
      svg
      .append('path')
      .datum(con.cases)
      .attr('d', area)
      .attr('fill', '#bababa')
      .attr('fill-opacity', .3);
      
      svg
      .append('path')
      .datum(con.cases)
      .attr('d', line)
      .attr('stroke', '#333333')
      .attr('stroke-width', 1.5)
      .attr('fill', 'none');
      
      const xAxis = svg.append("g")
      .call(d3.axisBottom(xScale)
            .ticks(3)
      )
      .attr('transform', 'translate(' + 0 + ',' + marginBottom + ')')

      xAxis.selectAll(".tick text")
      .attr('fill', '#333');

      xAxis.selectAll(".tick line")
      .attr('stroke', '#333');

      svg.selectAll(".domain").remove();
      
}