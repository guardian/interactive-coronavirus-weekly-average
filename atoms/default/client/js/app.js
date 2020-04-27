import * as d3 from 'd3'
import { numberWithCommas, getDataUrlForEnvironment, beautyTimestamp } from 'shared/js/util'

let isMobile = window.matchMedia('(max-width: 600px)').matches;

const atomEl = d3.select('.interactive-wrapper').node();

let width = atomEl.getBoundingClientRect().width;
let height = isMobile ? width * 1.6 : 752 * width / 1260;

const parseTime = d3.timeParse("%m/%d/%y");

d3.csv('https://interactive.guim.co.uk/2020/coronavirus-jh-timeline-data/time_series_covid19_confirmed_global.csv')
.then(casesRaw => {

	const dates = Object.entries(casesRaw[0]).slice(4, casesRaw[0].length).map( e => e[0]);

	const datesJS = Object.entries(casesRaw[0]).slice(4, casesRaw[0].length).map( e => parseTime(e[0]));

	const startEndDates = d3.extent(datesJS);

	let places = [];
  
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
  
  
  
	casesRaw
	  .filter(place => place['Country/Region'] != 'Canada')
	  .filter(place => place['Country/Region'] != 'Australia')
	  .filter(place => place['Country/Region'] != 'China')
	  .filter(place => place['Country/Region'] != 'United Kingdom')
	  .map((p,i) => {
	    
	    places.push({province:p['Province/State'], country:p['Country/Region'], lat:p.Lat, lon:p.Long, cases:[]})
	    
	    dates.map((d,j) => places[i].cases.push({date: d, acum: +p[d], new: j == 0 ? +p[d] : p[d] - p[dates[j-1]] ,weekly:0}))
	  })
  
  
	 places.push(canadaRaw)
	 places.push(australiaRaw)
	 places.push(chinaRaw)
	 places.push(ukRaw)

  
  
	  places.map( p => {

	    p.cases.map((c,i) => {
	    
	      const data = p.cases.slice(i,i+7);

	      c.weekly = d3.sum(data , s => s.new) / data.length;
	    
	    })
	  })


	  places.sort((a,b) => d3.max(b.cases, d=> d.acum) - d3.max(a.cases, d => d.acum))






const chartW = 25 * width / 100;
  
  const chartH = chartW * .25;
  
  const marginBottom = chartH - 20;
  
  let xScale = d3.scaleTime()
  .range([0, chartW - 10])
  .domain(startEndDates)

  let yScale = d3.scaleLinear()
  .range([chartH - 20, 2])
  
  let line = d3.line()
  .x(d => xScale(parseTime(d.date)))
  .y(d => yScale(d.weekly))
  .curve(d3.curveCardinal)
  
  let area = d3.area()
  .x(d => xScale(parseTime(d.date)))
  .y0(d => yScale(d.new))
  .y1(chartH - 20)
  .curve(d3.curveStepBefore)

  places.map( con => {
    
    if(d3.max(con.cases, d => d.acum) > 10000)
    {
      
      let div = d3.select(".interactive-wrapper").append('div')
      .style('width', '25%')
      .style('display', 'inline-block');

      let head = div.append("p")
      .html(con.country)

      let svg = div.append("svg")
      .attr("viewBox", [0, 0, chartW, chartH]);


      yScale.domain([0, d3.max(con.cases, d => d.weekly)])
      
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
      .attr('stroke', '#c70000')
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
      
      
      const yAxis = svg.append("g")
      .call(d3.axisLeft(yScale)
            .ticks(2)
            .tickSizeInner(-width + 10)
            .tickFormat(d => d)
      )
      .style('stroke-dasharray', '1,2')
      .selectAll("text")
      .style("text-anchor", "start")
      .attr('x', 0)
      .attr('y', -10);


      
      svg.selectAll(".domain").remove();
      
      }
   })

})