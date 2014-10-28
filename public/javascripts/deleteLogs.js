function deleteLogs(){
	console.log("delete logs");
	$.post("./upload", { serverCommand: "LOG_CLEAR" });
};