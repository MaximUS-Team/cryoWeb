function updateTestSettings(){
	//console.log("Update test settings!");
	var sp = document.getElementsByName("rangeInputP")[0].value;
	var si = document.getElementsByName("rangeInputI")[0].value;
	var sd = document.getElementsByName("rangeInputD")[0].value;
	var scm = document.getElementById("tempControl").value;
	var spow = document.getElementById("power").value;
	//console.log(sp + "," + si + "," + sd + "," + scm + "," + spow);
	$.post("./upload", {updateSettings: [sp, si, sd, scm, spow]});
};