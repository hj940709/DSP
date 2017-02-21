function submit(){
	/* If jquery is allowed
	var arg1 = $("#arg1").val();
	var arg2 = $("#arg2").val();
	var op = $("#op").val();
	*/
	var arg1 = document.getElementById("arg1").value;
	var arg2 = document.getElementById("arg2").value;
	var op = document.getElementById("op").value;
	if(arg1=="") arg1="0";
	if(arg2=="") arg2="0";
	var result = submitSimCal(arg1,arg2,op,false);
	if(op=="%2B") op="+";
	//Show the result
	alert(arg1+op+arg2+"="+result);
	//Logging to the history
	var historyArray = JSON.parse(sessionStorage.history);
	historyArray.unshift(arg1+op+arg2+" = "+result);
	sessionStorage.history = JSON.stringify(historyArray);
	//Reset form
	/* If jquery is allowed
	$("#arg1").val("");
	$("#arg2").val("");
	$("#op").val("%2B");
	*/
	document.getElementById("arg1").value="";
	document.getElementById("arg2").value="";
	document.getElementById("op").value="%2B";
	//Re-display history list
	html = "";
	for(var i = 0;i<historyArray.length;i++){
		html += "<tr><td>"+historyArray[i]+"</td></tr>";
	}
	//$("#history").html(html);
	document.getElementById("history").innerHTML = html;
}