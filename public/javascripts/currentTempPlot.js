
//var request = require('request');
var data = [];// = [1,2,3];
var margin = {top: 30, right: 30, bottom: 30, left: 60},
    width = 500 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;
var datLength = 20;

// initialise chart
var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// create X axis
var xAxis = d3.svg.axis()
    .orient("bottom");
var xAxisG = chart.append("g")
    .attr("class","x axis")
    .attr("transform", "translate(0," + height + ")")
var yAxis = d3.svg.axis()
    .orient("left");
var yAxisG = chart.append("g")
    .attr("class","y axis");
yAxisG.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y",-60)
    .attr("x",-20)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Temperature (K)");

setInterval(function() {
    $.getJSON("./data?type=status&data=T", function(res) {
        data.push(Math.round(res.T*1000)/1000);
        while (data.length > datLength) {
            data.shift();
        }

        // update axes
        var x = d3.scale.linear()
            .domain([0, data.length])
            .range([0, width]);
        var barWidth = width/data.length;
        var y = d3.scale.linear()
            .domain([1.1*d3.min(data)-0.1*d3.max(data), d3.max(data)])
            .range([height, 0]);
        xAxisG.call(xAxis.scale(x));
        yAxisG.call(yAxis.scale(y));

        // data join
        var bar = chart.selectAll(".bar")
            .data(data)
            .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });
        // update data
        bar.select("rect")
            .attr("y",function(d) { return y(d); })
            .attr("height", function(d) { return height - y(d); })
            .attr("width", barWidth - 1);
        // enter data
        var barEnter = bar.enter().append("g")
            .attr("class","bar")
            .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });
        barEnter.append("rect")
            .attr("y",function(d) { return y(d); })
            .attr("height", function(d) { return height - y(d); })
            .attr("width", barWidth - 1);

        // AXIS
        // join
        chart.selectAll(".axis")
        // update
    })
},1000);