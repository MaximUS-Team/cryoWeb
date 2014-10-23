function criticalLog(){
	$.getJSON("./data?type=log", function(res) {
		var logList = document.getElementById("lstLog");
		logList.innerHTML = '';
		res.forEach(function(element) {
			if (element.level === 'critical'){
				var newListItem = document.createElement("li");
				var newListValue = document.createTextNode("[" + String(element.timestamp) + "] " + String(element.level).toUpperCase()
				+ ": " + String(element.message));
				newListItem.appendChild(newListValue);
				logList.appendChild(newListItem);
			};
		});
	});
};