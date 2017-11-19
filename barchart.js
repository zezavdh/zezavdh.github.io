// The svg selected from html with margin/position with and height
var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 250},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

// Making a variable. The input and output of the data you have
var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

// Making a variable g. g groups svg shapes together. From left to top
var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Making a variable of the color of the bars
var colours = d3.scaleOrdinal()
   .range(["#4ebc1b"]);

// Making a variable and select the div toolTip from html
var tooltip = d3.select("body").append("div").attr("class", "toolTip");

// connecting/loading the tsv file
d3.tsv("barchart.tsv", function(d) {
  d.percentage = +d.percentage;
  return d;
}, function(error, data) {
  if (error) throw error;

  //loading the data from the tsv file
  x.domain(data.map(function(d) { return d.leeftijden; }));
  y.domain([0, d3.max(data, function(d) { return d.percentage; })]);

  // Setting the x-axis
  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Setting the y-axis with ticks
  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "%"))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Percentage");

    // The x values in the bars
    var bar= g.selectAll(".bar")
      .data(data)
      .enter().append("rect")
        .attr("x", function(d) { return x(d.leeftijden); })
        .attr("width", x.bandwidth())
        .attr("y", height)
        .attr("height", 0)
        .attr("fill", function(d) { return colours(d.leeftijden); })
       
    // the transition by loading the chart. In 1 second the bars are high as they should be with a transition.
     bar.transition()
        .duration(1000)
        .delay(100)
        .attr("y", function(d) { return y(d.percentage); })
        .attr("height", function(d) { return height - y(d.percentage); })
        
    // showing the tooltip by mouseover
     bar.on("mousemove", function(d){
            tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html((d.percentage));
        })
     //tooltip disapear by mouseout
        .on("mouseout", function(d){ tooltip.style("display", "none");});
});


