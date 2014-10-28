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
        document.getElementById("currentTestStatus").innerHTML = "RUNNING";
        document.getElementById("currentTestStatus").className = "lblCurrentTSValueRunning"
      } else if (status == "PAUSED") {
        // test is paused, allow resuming and stopping
        document.getElementById("btnPause").disabled = false;
        document.getElementById("btnPause").innerHTML = "Resume Test";
        document.getElementById("btnStop").disabled = false;
        document.getElementById("currentTestStatus").innerHTML = "PAUSED";
        document.getElementById("currentTestStatus").className = "lblCurrentTSValuePaused"
      } else {
        // test is stopped, do not allow anything
        document.getElementById("btnPause").disabled = true;
        document.getElementById("btnStop").disabled = true;
        document.getElementById("currentTestStatus").innerHTML = "STOPPED";
        document.getElementById("currentTestStatus").className = "lblCurrentTSValueStopped"
      }
      // update the test skip button & test skip points
      if (res.testpoints && res.testpoints.length > 0 &&
        (status === "RUNNING" || status === "PAUSED")) {
          document.getElementById("btnSkip").disabled = false;
      } else {
        document.getElementById("btnSkip").disabled = true;
      }
      // update the PID settings
      document.getElementById("lblCurrentP").innerHTML = res.p;
      document.getElementById("lblCurrentI").innerHTML = res.i;
      document.getElementById("lblCurrentD").innerHTML = res.d;
      // update the temperature control settings
      document.getElementById("lblCurrentControlMode").innerHTML = res.controlmode;
      document.getElementById("lblCurrentPower").innerHTML = res.power;
      // set the new test points
      var tstpts = document.getElementById("remainingTestPoints");
      tstpts.options.length = 0;
      if (res.testpoints.length === 0) {
        var option = document.createElement("option");
        option.innerHTML = "none";
        tstpts.add(option);
      } else {
        for (var point in res.testpoints) {
          var option = document.createElement("option");
          option.innerHTML = res.testpoints[point];
          tstpts.add(option);
        }
      }
      // update the label with the latest test point
      document.getElementById("currentTP").innerHTML = tstpts.options[0].innerHTML;
    });
  }

  updateSettings();
  setInterval(function() {
    updateSettings();
  }, 5000);
})();