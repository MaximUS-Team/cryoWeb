function skipTestPoint(){
	//console.log("Yellow - Skip Current Test Point");
	$.post("./upload", { serverCommand: "SKIP_TEST_POINT" });
};