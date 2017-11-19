// Define margins, dimensions, and some line colors
var margin = {top: 40, right: 120, bottom: 30, left: 100};
var width = 800 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

// Define the scales and tell D3 how to draw the line
var x = d3.scaleLinear().domain([2010, 2030]).range([0, width]);     
var y = d3.scaleLinear().domain([0, 4]).range([height, 0]);
var line = d3.line().x(d => x(d.year)).y(d => y(d.population));

// Select the svg from html
var chart = d3.select('svg').append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// Select the tooltip and tooltip line from html  
var tooltip = d3.select('#tooltip');
var tooltipLine = chart.append('line');
  
// Add the x-axis and y-axis
var xAxis = d3.axisBottom(x).tickFormat(d3.format('.4'));
var yAxis = d3.axisLeft(y).tickFormat(d3.format('.2s'));
chart.append('g').call(yAxis); 
chart.append('g').attr('transform', 'translate(0,' + height + ')').call(xAxis);
chart.append('text').html('').attr('x', 200);
  
// Load the data and draw a chart
let states, tipBox;
d3.json('linechart.json', d => {
  states = d;

  // The strokes of the chart
  chart.selectAll()
    .data(states).enter()
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', d => d.color)
    .attr('stroke-width', 2)
    .datum(d => d.history)
    .attr('d', line);
  
  // The color, text and data
  chart.selectAll()
    .data(states).enter()
    .append('text')
    .html(d => d.name)
    .attr('fill', d => d.color)
    .attr('alignment-baseline', 'middle')
    .attr('x', width)
    .attr('dx', '.5em')
    .attr('y', d => y(d.currentPopulation)); 
  
  // The tooltip container
  tipBox = chart.append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('opacity', 0)
    .on('mousemove', drawTooltip)
    .on('mouseout', removeTooltip);
})

//Tooltip mouseout
function removeTooltip() {
  if (tooltip) tooltip.style('display', 'none');
  if (tooltipLine) tooltipLine.attr('stroke', 'none');
}

//show tooltip. This is a calculation of the years and steps between them. It is a difficult line for me to understand.
function drawTooltip() {
  var year = Math.floor((x.invert(d3.mouse(tipBox.node())[0]) + 5) / 10) * 10;
  
  states.sort((a, b) => {
    return b.history.find(h => h.year == year).population - a.history.find(h => h.year == year).population;
  })  
  
  //The tooltip vertical line in de graph  
  tooltipLine.attr('stroke', 'black')
    .attr('x1', x(year))
    .attr('x2', x(year))
    .attr('y1', 0)
    .attr('y2', height);
  
  // Showing the tooltip
  tooltip.html(year)
    .style('display', 'block')
    .style('left', d3.event.pageX + 20)
    .style('top', d3.event.pageY - 20)
    .selectAll()
    .data(states).enter()
    .append('div')
    .style('color', d => d.color)
    .html(d => d.name + ': ' + d.history.find(h => h.year == year).population);
}