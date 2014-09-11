//var winston = require('winston');
//var MongoDB = require('winston-mongodb').MongoDB;

function logTest(){
	console.log('test log button console');

	$.getJSON("./data?type=log", function(res) {
		var logList = document.getElementById("lstLog");
		logList.innerHTML = '';
		res.forEach(function(element) {
			var newListItem = document.createElement("li");
			var newListValue = document.createTextNode("[" + String(element.timestamp) + "] " + String(element.level).toUpperCase()
				+ ": " + String(element.message));
			newListItem.appendChild(newListValue);
			logList.appendChild(newListItem);
		});
	});
	//var logList = document.getElementById("lstLog");
	//logList.innerHTML = '';

	//var newListItem = document.createElement("li");
	//var newListValue = document.createTextNode("Test");
	//newListItem.appendChild(newListValue);
	//logList.appendChild(newListItem);


	//logger.log('info', 'Log test.');
};