(function() {
  updateSettings = function() {
    $.getJSON("./data?type=current", function(res) {
      // update the status buttons
      var status = res.status;
      if (status == "RUNNING") {
        // test is running, allow pausing and stopping
        document.getElementById("btnPause").disabled = false;
        document.getElementById("btnPause").innerHTML = "Pause Test";
        document.getElementById("btnStop").disabled = false;
      } else if (status == "PAUSED") {
        // test is paused, allow resuming and stopping
        document.getElementById("btnPause").disabled = false;
        document.getElementById("btnPause").innerHTML = "Resume Test";
        document.getElementById("btnStop").disabled = false;
      } else {
        // test is stopped, do not allow anything
        document.getElementById("btnPause").disabled = true;
        document.getElementById("btnStop").disabled = true;
      }
      // update the test skip button & test skip points
      if (res.testpoints && res.testpoints.length > 0) {
        if (status == "RUNNING" || status == "PAUSED") {
          document.getElementById("btnSkip").disabled = true;
        }
      } else {
        document.getElementById("btnSkip").disabled = true;
      }
      // update the PID settings
      // update the temperature control settings
    });
  }

  updateSettings();
  setInterval(function() {
    updateSettings();
  }, 1000);
})();