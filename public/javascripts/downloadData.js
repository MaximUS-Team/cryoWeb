function downloadSNPData() {
	$.getJSON("./data?type=status&data=Snp", function(res) {
		var text = "frequency,S11 re,S11 im,S12 re,S12 im,S21 re,S21 im,S22 re,S22 im\n";
		res.forEach(function(element) {
			text += element["Frequency"] + "," + element["S11 Re"] + "," + element["S11 Im"] + "," + element["S12 Re"] + "," + element["S12 Im"] +
				"," + element["S21 Re"] + "," + element["S21 Im"] + "," + element["S22 Re"] + "," + element["S22 Im"] + "\n";
		});
		var pom = document.createElement('a');
		pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		pom.setAttribute('download', 'snpdata.csv');
		pom.click();
	});
}

function activateSVGCrowbar() {
	// Utilizes the SVG-crowbar bookmark code
	// Author of svg-crowbar.js: NYTimes (<https://github.com/NYTimes>)
	// Author of script: Hugolpz
	// Retrieved from: <http://stackoverflow.com/questions/18492617/button-to-download-inpage-svg-code-as-an-svg-file>
	var e = document.createElement('script');
	if (window.location.protocol === 'https:') {
		e.setAttribute('src', 'https://cdn.rawgit.com/NobleFable/svg-crowbar/fb62f9f69a1502ff8520f497fc4fd8d1362fb797/svg-crowbar.js');
	} else {
		e.setAttribute('src', 'http://cdn.rawgit.com/NobleFable/svg-crowbar/fb62f9f69a1502ff8520f497fc4fd8d1362fb797/svg-crowbar.js');
	}
	e.setAttribute('class', 'svg-crowbar');
	document.body.appendChild(e);
}