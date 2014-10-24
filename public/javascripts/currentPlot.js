
var currentChartType = "-";
var chart;
var xAxis;
var yAxis;
var margin;
var width;
var height;
var path;

(function() {
  var data;

  data = [];
  margin = {top: 30, right: 30, bottom: 40, left: 40};
  width = 500 - margin.left - margin.right;
  height = 500 - margin.top - margin.bottom;

  // initialise chart
  chart = d3.select(".DisplayChart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top +
      ")");
  updatePlot = function() {
    checkDisplay();
  }
  updatePlot();
  setInterval(function() {
      updatePlot();
  },5000);
})()

function checkDisplay() {
  console.log("Test1");
  // get the chart
  // get the current value of the dropbox
  var type = document.getElementById("graphType").value;
  var newType = currentChartType != type;
  currentChartType = type;
  console.log("OldType: " + currentChartType + ", NewType: " + type);
  if (type == "TempVTime") {
    if (newType) { console.log("Test2"); }
    updateTempVTime(newType);
  } else if (type == "SNPReVSNPImag") {
    if (newType) { console.log("Test3"); }
    updateSNPReVSNPImag(newType);
  }
}

function updateTempVTime(updateGraph) {
  var data = [];
  if (updateGraph) {
    chart.text('');
    // create X axis
    xAxis = d3.svg.axis()
      .orient("bottom");
    xAxis.tickFormat(function(d) { return d3.time.format("%H:%M:%S")(
      new Date(d)); })
      .ticks(5); // max. no. ticks
    chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0, " + height + ")")
      .append("text")
      .attr("y", 20)
      .attr("x",(width - margin.right)/2)
      .attr("dy", ".71em")
      .style("text-anchor", "middle")
      .text("Time");

    // create Y axis
    yAxis = d3.svg.axis()
      .orient("left");
    chart.append("g")
      .attr("class", "y axis")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -60)
      .attr("x", -20)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Temperature (K)");

    // create path generator
    path = chart.append("path")
      .attr("class", "line");
  }
  getT = function(data) { return data.T; }
  getTime = function(data) { return data.time; }
  $.getJSON("./data?type=status&data=T", function(res) {
    // Update data
    /*
    data.push({time: new Date(), T: Math.round(
      res.T*1000)/1000});
    while (data.length > datLength) {
      data.shift();
    }*/
    data = [];
    res.forEach(function(element) {
      data.push({
        T: parseFloat(element.T),
        time: Date.parse(element.time)
      });
    });
    data.sort(function(a, b) { return b.time - a.time; });

    // update axes
    var x = d3.scale.linear()
      .domain([d3.min(data, getTime), d3.max(data, getTime)])
      .range([0, width]);
    var circleWidth = width / data.length;
    var y = d3.scale.linear()
      .domain([1.1 * d3.min(data, getT)
      -0.1 * d3.max(data, getT), d3.max(data, getT)])
      .range([height, 0]);
    chart.selectAll(".x.axis")
      .call(xAxis.scale(x));
    chart.selectAll(".y.axis")
      .call(yAxis.scale(y));

    // data join
    var line = d3.svg.line()
      .x(function(d) { return x(d.time); })
      .y(function(d) { return y(d.T); })
      .interpolate("linear");
    path.datum(data)
      .attr("d", line);


    // AXIS
    // join
    chart.selectAll(".axis");
    // update
  });
}

function updateSNPReVSNPImag(updateGraph) {
  if (updateGraph) {
    chart.text('');
    // create X axis
    xAxis = d3.svg.axis()
      .orient("bottom");
    chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0, " + height + ")")
      .append("text")
      .attr("y", margin.bottom)
      .attr("x",(width - margin.right)/2)
      .attr("dy", "-.5em")
      .style("text-anchor", "middle")
      .text("Real");
    var x = d3.scale.linear()
      .domain([-1, 1]) // passive limits
      .range([0, width]);

    // create Y axis
    yAxis = d3.svg.axis()
      .orient("left");
   chart.append("g")
      .attr("class", "y axis")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left)
      .attr("x", 0)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Imaginary");
    var y = d3.scale.linear()
      .domain([-1, 1])
      .range([height, 0]);

    // create path generator
    path = chart.append("path")
      .attr("class", "line");
  }
  getT = function(data) { return data.T; }
  getTime = function(data) { return data.time; }
  $.getJSON("./data?type=status&data=Snp", function(res) {
    S11 = [];
    S12 = [];
    S21 = [];
    S22 = [];
    res.forEach(function(element) {
      S11.push({
        Frequency: parseFloat(element.Frequency),
        Re: parseFloat(element["S11 Re"]),
        Im: parseFloat(element["S11 Im"])
      });
      S12.push({
        Frequency: parseFloat(element.Frequency),
        Re: parseFloat(element["S12 Re"]),
        Im: parseFloat(element["S12 Im"])
      });
      S21.push({
        Frequency: parseFloat(element.Frequency),
        Re: parseFloat(element["S21 Re"]),
        Im: parseFloat(element["S21 Im"])
      });
      S22.push({
        Frequency: parseFloat(element.Frequency),
        Re: parseFloat(element["S22 Re"]),
        Im: parseFloat(element["S22 Im"])
      });
    });
    S11.sort(function(a, b) { return b.Frequency - a.Frequency; });
    S12.sort(function(a, b) { return b.Frequency - a.Frequency; });
    S11.sort(function(a, b) { return b.Frequency - a.Frequency; });
    S22.sort(function(a, b) { return b.Frequency - a.Frequency; });

    // update axes // can this go outside?
    chart.selectAll(".x.axis")
      .call(xAxis.scale(x));
    chart.selectAll(".y.axis")
      .call(yAxis.scale(y));

    // data join
    var line = d3.svg.line()
      .x(function(d) { return x(d.Re); })
      .y(function(d) { return y(d.Im); })
      .interpolate("linear");
    path.datum(S11)
      .attr("d", line);


    // AXIS
    // join
    chart.selectAll(".axis");
    // update
  });
}