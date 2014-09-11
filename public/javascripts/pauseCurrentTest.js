function pauseCurrentTest(){
	//console.log("Orange - Pause Test Request");
	$.post("./upload", { serverCommand: "TOGGLE_PAUSE" });
};