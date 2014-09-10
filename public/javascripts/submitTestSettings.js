function updateTestSettings(){
	//console.log("Update test settings!");
	var sp = document.getElementsByName("rangeInput")[0].value;
	var si = document.getElementsByName("rangeInput")[1].value;
	var sd = document.getElementsByName("rangeInput")[2].value;
	var scm = document.getElementById("tempControl").value;
	var spow = document.getElementById("power").value;
	//console.log(sp + "," + si + "," + sd + "," + scm + "," + spow);
	$.post("./upload", {updateSettings: [sp, si, sd, scm, spow]});
};