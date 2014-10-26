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