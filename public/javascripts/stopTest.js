function stopTest(){
	//console.log("Red - Stop Test Request");
	$.post("./upload", { serverCommand: "STOP_TEST" });
};