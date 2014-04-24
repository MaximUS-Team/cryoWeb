
//var request = require('request');
var data = [];// = [1,2,3];
var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;
var datLength = 20;
var barWidth = width/datLength;

// initialise chart
var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", height);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", 50)
  .append("g")
    .attr("transform", "translate(32," + (25) + ")");


setInterval(function() {
    $.getJSON("./data?type=status&data=T", function(res) {
        data.push(Math.round(res.T*1000)/1000);
        while (data.length > datLength) {
            data.shift();
        }

        // scale y
        var y = d3.scale.linear()
            .domain([1.1*d3.min(data)-0.1*d3.max(data), d3.max(data)])
            .range([height, 0]);

        var bar = chart.selectAll("g")
            .data(data);
        bar.select("rect")
            .attr("y",function(d) { return y(d); })
            .attr("height", function(d) { return height - y(d); })
            .attr("width", barWidth - 1);
        bar.select("text")
            .attr("x", barWidth - 3)
            .attr("y", function(d) { return y(d) + 3; })
            .attr("dy", ".75em")
            .text(function(d) { return d; });
            
        var barEnter = bar.enter().append("g")
            .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });
        barEnter.append("rect")
            .attr("y",function(d) { return y(d); })
            .attr("height", function(d) { return height - y(d); })
            .attr("width", barWidth - 1);
        barEnter.append("text")
            .attr("x", barWidth - 3)
            .attr("y", function(d) { return y(d) + 3; })
            .attr("dy", ".75em")
            .text(function(d) { return d; });

        /*//Div Code
        d3.select(".chart")
          .selectAll("div")
            .data(data)
            .style("width", function(d) { return x(d) + "px"; })
          .enter().append("div")
            .style("width", function(d) { return x(d) + "px"; })
            .text(function(d) { return d; });
        */
        // LOGGING
        // Data Join
        var text = svg.selectAll("text")
            .data([data.length,data]);
        // Update
        text.attr("class","logdata");
        // Enter
        text.enter().append("text")
            .attr("x", function(d, i) { return i * 20; })
            .attr("dy", ".35em");
        // Enter & Update
        text.text(function(d) { return d; });
        // Exit
        text.exit().remove();
    })
},1000);