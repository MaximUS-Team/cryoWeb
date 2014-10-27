function pauseCurrentTest(){
	if (document.getElementById("btnPause").innerHTML === "Pause Test") {
		//console.log("Orange - Pause Test Request");
		$.post("./upload", { serverCommand: "PAUSE" });
	} else {
		$.post("./upload", { serverCommand: "UNPAUSE" });
	}
};