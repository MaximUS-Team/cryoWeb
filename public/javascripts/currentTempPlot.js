
//var request = require('request');
var data = [];// = [1,2,3];
var margin = {top: 30, right: 30, bottom: 30, left: 50},
    width = 500 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;
var datLength = 20;
var barWidth = width/datLength;

// initialise chart
var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// create X axis
var x = d3.scale.linear()
    .domain([0, datLength])
    .range([0, width]);
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
chart.append("g")
    .attr("class","x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
var yAxis = d3.svg.axis()
    .orient("left");
var yAxisG = chart.append("g")
    .attr("class","y axis");

setInterval(function() {
    $.getJSON("./data?type=status&data=T", function(res) {
        data.push(Math.round(res.T*1000)/1000);
        console.log(data);
        while (data.length > datLength) {
            data.shift();
        }

        // create Y axis
        var y = d3.scale.linear()
            .domain([1.1*d3.min(data)-0.1*d3.max(data), d3.max(data)])
            .range([height, 0]);
        yAxisG.call(yAxis.scale(y));

        // data join
        var bar = chart.selectAll(".bar")
            .data(data);
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