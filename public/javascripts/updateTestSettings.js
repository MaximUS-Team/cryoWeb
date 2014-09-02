(function() {
  updateSettings = function() {
    $.getJSON("./data?type=current", function(res) {
      var status = res.status;
      if (status == "RUNNING") {
        document.getElementById("btnPause").disabled = false;
        document.getElementById("btnSkip").disabled = false;
        document.getElementById("btnStop").disabled = false;
      } else if (status == "PAUSED") {
        document.getElementById("btnPause").disabled = true;
        document.getElementById("btnSkip").disabled = false;
        document.getElementById("btnStop").disabled = false;
      } else {
        document.getElementById("btnPause").disabled = true;
        document.getElementById("btnSkip").disabled = true;
        document.getElementById("btnStop").disabled = true;
      }
    });
  }

  updateSettings();
  setInterval(function() {
    updateSettings();
  }, 1000);
})();