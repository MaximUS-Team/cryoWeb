var data = [];
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
    .attr("transform", "translate(0," + height + ")");
xAxisG.append("text")
    .attr("y",20)
    .attr("x",(width - margin.right)/2)
    .attr("dy", ".71em")
    .style("text-anchor", "middle")
    .text("Time");
// create Y axis
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
        data.push({time: Date.now(), T: Math.round(
            res.T*1000)/1000});
        while (data.length > datLength) {
            data.shift();
        }

        // update axes
        var x = d3.scale.linear()
            .domain([0, data.length])
            .range([0, width]);
        var circleWidth = width/data.length;
        var y = d3.scale.linear()
            .domain([1.1*d3.min(data,getT)
            -0.1*d3.max(data,getT), d3.max(data,getT)])
            .range([height, 0]);
        xAxisG.call(xAxis.scale(x));
        yAxisG.call(yAxis.scale(y));

        // data join
        var circle = chart.selectAll("circle")
            .data(data);
        circle.enter().append("circle")
            .attr("r",2);
        circle.exit().remove();
        circle.attr("cy",function(d) { return y(d.T); })
            .attr("cx", function(d, i) { return i * circleWidth; })

        // AXIS
        // join
        chart.selectAll(".axis")
        // update
    })
},1000);

getT = function(data) { return data.T; }