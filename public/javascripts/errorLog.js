function errorLog(){
	$.getJSON("./data?type=log", function(res) {
		var logList = document.getElementById("lstLog");
		logList.innerHTML = '';
		var entries = 0;
		res.forEach(function(element) {
			if (element.level === 'err'){
				var newListItem = document.createElement("li");
				var newListValue = document.createTextNode("[" + String(element.timestamp).substring(0, 24) + "] " + String(element.level).toUpperCase()
				+ ": " + String(element.message));
				newListItem.appendChild(newListValue);
				logList.appendChild(newListItem);
				entries += 1;
			};
		});
		if (entries === 0) {
			var newListItem = document.createElement("li");
			var newListValue = document.createTextNode("This log is empty.");
			newListItem.appendChild(newListValue);
			logList.appendChild(newListItem);
		}
	});
};