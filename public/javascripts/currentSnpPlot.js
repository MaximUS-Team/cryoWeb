var SnpupdateTime = 10000;
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

  var S11 = [], S12 = [], S21 = [], S22 = [],
      x = d3.scale.linear(), y = d3.scale.linear();

  function key(data) {
    return data.Frequency;
  }
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
      var freqSort = function(a, b) { return b.Frequency - a.Frequency; };
      S11.sort(freqSort);
      S12.sort(freqSort);
      S21.sort(freqSort);
      S22.sort(freqSort);
    });
  }
  setupPlotType = function() {
    switch(d3.select("#selectType").node().value){
      case "Re vs. Im":
        setupReIm();
        plotFunc = plotReIm;
        d3.select('#doLogY').property("checked", false)
        d3.select('#doLogY').property("disabled", true)
        break;
      case "Magnitude vs. Freq":
        setupMagFreq();
        plotFunc = plotMagFreq;
        d3.select('#doLogY').property("disabled", false)
        break;
      case "Phase vs. Freq":
        setupPhaseFreq();
        plotFunc = plotPhaseFreq;
        d3.select('#doLogY').property("checked", false)
        d3.select('#doLogY').property("disabled", true)
        break;
      default:
        console.log("Error: Unknown selection " + d3.select("#selectType").node().value);
    }
  }
  setupReIm = function() {
    snpchart.select(".x.axis").select("text").text("Real");
    snpchart.select(".y.axis").select("text").text("Imaginary");
  }
  setupMagFreq = function() {
    snpchart.select(".x.axis").select("text").text("Frequency");
    snpchart.select(".y.axis").select("text").text("Magnitude");
  }
  setupPhaseFreq = function() {
    snpchart.select(".x.axis").select("text").text("Frequency");
    snpchart.select(".y.axis").select("text").text("Phase (rad)");
  }
  updateSnpPlot = function() {
    // read user settings
    setupPlotType();

    if (d3.select('#doLogY')[0][0].checked) {
      y = d3.scale.log()
        .base(Math.E)
      yAxis = d3.svg.axis()
        .orient("left")
        .tickFormat(function(d) { return "10^" + Math.round(Math.log(d)); });
    } else {
      y = d3.scale.linear()
      yAxis = d3.svg.axis()
        .orient("left");
    }

    // plot line
    var line = plotFunc();

    // update axes // can this go outside?
    snpchart.selectAll(".x.axis")
      .call(xAxis.scale(x));
    snpchart.selectAll(".y.axis")
      .call(yAxis.scale(y));

    // Apply Data
    if (d3.select('#doS11')[0][0].checked) {
      path11.datum(S11)
        .transition()
          .duration(1000)
          .attr("d", line);
    } else {
      path11.datum(0).attr("d", line);
    }
    if (d3.select('#doS21')[0][0].checked) {
      path21.datum(S21)
        .transition()
          .duration(1000)
          .attr("d", line);
    } else {
      path21.datum(0).attr("d", line);
    }
    if (d3.select('#doS12')[0][0].checked) {
      path12.datum(S12)
        .transition()
          .duration(1000)
          .attr("d", line);
    } else {
      path12.datum(0).attr("d", line);
    }
    if (d3.select('#doS22')[0][0].checked) {
      path22.datum(S22)
        .transition()
          .duration(1000)
          .attr("d", line);
    } else {
      path22.datum(0).attr("d", line);
    }
  }
  plotReIm = function() {
    x.domain([-1, 1]) // passive limits
      .range([0, width]);
    y.domain([-1, 1])
      .range([height, 0]);

    xAxis.ticks(11, "f");
    yAxis.ticks(11, "f");

    // data join
    var line = d3.svg.line()
      .x(function(d) { return x(d.Re); })
      .y(function(d) { return y(d.Im); })
      .interpolate("linear");
    return(line);
  }
  plotMagFreq = function() {
    var getFreq = function(d) { return d.Frequency; }
    var getMag = function(d) { return Math.sqrt(d.Re*d.Re + d.Im*d.Im); }
    var xmin = d3.min([S11, S12, S21, S22], function(d) { return d3.min(d, getFreq); });
    var xmax = d3.max([S11, S12, S21, S22], function(d) { return d3.max(d, getFreq); });
    var ymin = d3.min([S11, S12, S21, S22], function(d) { return d3.min(d, getMag); });
    var ymax = d3.max([S11, S12, S21, S22], function(d) { return d3.max(d, getMag); });
    x.domain([xmin, xmax])
      .range([0, width]);
    y.domain([ymin, ymax])
      .range([height, 0]);

    xAxis.ticks(6, "s");
    yAxis.ticks(6, "f");
      
    // data join
    var line = d3.svg.line()
      .x(function(d) { return x(d.Frequency); })
      .y(function(d) { return y(Math.sqrt(d.Re*d.Re + d.Im*d.Im)); })
      .interpolate("linear");
    return(line);
  }
  plotPhaseFreq = function() {
    var getFreq = function(d) { return d.Frequency; }
    var xmin = d3.min([S11, S12, S21, S22], function(d) { return d3.min(d, getFreq); });
    var xmax = d3.max([S11, S12, S21, S22], function(d) { return d3.max(d, getFreq); });
    x.domain([xmin, xmax])
      .range([0, width]);
    y.domain([-Math.PI/2, Math.PI/2])
      .range([height, 0]);

    xAxis.ticks(6, "s");
    yAxis.ticks(6, "f")
      .tickFormat(function(d) { return Math.round(d / Math.PI * 10) / 10 + "π"; });
      
    // data join
    var line = d3.svg.line()
      .x(function(d) { return x(d.Frequency); })
      .y(function(d) { return y(Math.atan(d.Im / d.Re)); })
      .interpolate("linear");
    return(line);
  }
  var plotFunc = plotReIm;
  
  var selectEl = d3.select("#selectPlotType")
    .append("select")
      .attr("id", "selectType")
      .on("change", updateSnpPlot),
    options = selectEl.selectAll('option').data(["Re vs. Im", "Magnitude vs. Freq", "Phase vs. Freq"]); // Data join
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

  var sparams = d3.select("#selectPlotType");
  sparams.append("hr")
    .attr("width", "200px")
    .attr("align", "left");
  sparams.append("label")
      .text("log y scale");
  sparams.append("input")
      .property("checked", false)
      .property("disabled", true)
      .attr("type", "checkbox")
      .attr("id", "doLogY")
      .attr("onClick", "updateSnpPlot()");
  sparams.append("br");

  updateSnpPlot();
  setInterval(function() {
    loadLatestData();
    updateSnpPlot();
  }, SnpupdateTime);
})()