(function () {
  var S11col = "steelblue";
  var S12col = "green";
  var S21col = "mediumorchid";
  var S22col = "darkorange";
  var Scols = [S11col, S12col, S21col, S22col]

  var data = [];
  var margin = {top: 30, right: 30, bottom: 40, left: 40},
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // initialise chart
  var snpchart = d3.select(".Snpchart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top +
      ")");

  // create X axis
  var xAxis = d3.svg.axis()
    .orient("bottom");
  snpchart.append("g")
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
  var yAxis = d3.svg.axis()
    .orient("left");
 snpchart.append("g")
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
  var path11 = snpchart.append("path")
    .attr("class", "line")
    .style("stroke", S11col);
  var path12 = snpchart.append("path")
    .attr("class", "line")
    .style("stroke", S12col);
  var path21 = snpchart.append("path")
    .attr("class", "line")
    .style("stroke", S21col);
  var path22 = snpchart.append("path")
    .attr("class", "line")
    .style("stroke", S22col);

  var S11 = [], S12 = [], S21 = [], S22 = [];

  getT = function(data) { return data.T; }
  getTime = function(data) { return data.time; }
  loadLatestData = function() {
    $.getJSON("./data?type=status&data=Snp", function(res) {
      S11 = [], S12 = [], S21 = [], S22 = [];
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
    });
  }
  setupPlotType = function() {
    switch(d3.select("#selectType").node().value){
      case "Re vs. Im":
        console.log("Re vs. Im");
        break;
      default:
        console.log("Error: Unknown selection " + d3.select("#selectType").node().value);}
  }
  updateSnpPlot = function() {
    plotReIm();
  }
  plotReIm = function() {
    // update axes // can this go outside?
    snpchart.selectAll(".x.axis")
      .call(xAxis.scale(x));
    snpchart.selectAll(".y.axis")
      .call(yAxis.scale(y));

    // data join
    var line = d3.svg.line()
      .x(function(d) { return x(d.Re); })
      .y(function(d) { return y(d.Im); })
      .interpolate("linear");
    if (d3.select('#doS11')[0][0].checked) {
      path11.datum(S11).attr("d", line);
    } else {
      path11.datum(0).attr("d", line);
    }
    if (d3.select('#doS21')[0][0].checked) {
      path21.datum(S21).attr("d", line);
    } else {
      path21.datum(0).attr("d", line);
    }
    if (d3.select('#doS12')[0][0].checked) {
      path12.datum(S12).attr("d", line);
    } else {
      path12.datum(0).attr("d", line);
    }
    if (d3.select('#doS22')[0][0].checked) {
      path22.datum(S22).attr("d", line);
    } else {
      path22.datum(0).attr("d", line);
    }
  }
  
  var selectEl = d3.select("#selectSparams")
    .append("select")
      .attr("id", "selectType")
      .on("change", setupPlotType),
    options = selectEl.selectAll('option').data(["Re vs. Im", "Magnitude (abs) vs. Freq"]); // Data join
  options.enter().append("option").text(function(d) { return d; });

  var lab = d3.select("#selectSparams").selectAll("label")
    .data(["S11", "S12", "S21", "S22"])
    .enter()
    .append("label")
      .text(function(d) { return d; })
      .style("color", function(d, i) { return Scols[i]; });
  lab.append("input")
      .attr("checked", true)
      .attr("type", "checkbox")
      .attr("id", function(d) { return "do" + d; })
      .attr("onClick", "updateSnpPlot()");
  lab.append("br");

  updateSnpPlot();
  setInterval(function() {
    loadLatestData();
    updateSnpPlot();
  }, 2000);
})()