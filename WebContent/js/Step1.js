function calculate(){
	var outputhtml = "";
	//var equation = $("#equation").val();
	var equation = document.getElementById("equation").value;
	//parse the equation
	var main = resolve(equation);
	var result = "";
	while(main[2]!=""){
		var arg1 = main[0];
		var op = main[1];
		var secondary = resolve(main[2]);
		var arg2 = secondary[0];
		if(op=="+") op="%2B";
		result = submitSimCal(arg1,arg2,op,false);
		//Adding output node
		outputhtml += "<tr><td>"+arg1+main[1]+arg2+" = "+result+"</td></tr>";
		
		if(result == "Infinity") break;
		
		main = resolve(result+secondary[1]+secondary[2]);
	}
	//Show the result
	alert(equation+"="+result);
	//Reset the form
	//$("#equation").val("");
	document.getElementById("equation").value="";
	//Logging to the history
	var historyArray = JSON.parse(sessionStorage.history);
	historyArray.unshift(equation+" = "+result);
	sessionStorage.history = JSON.stringify(historyArray);
	//Re-display history list
	var historyhtml = "";
	for(var i = 0;i<historyArray.length;i++){
		historyhtml += "<tr><td>"+historyArray[i]+"</td></tr>";
	}
	//$("#history").html(html);
	document.getElementById("history").innerHTML = historyhtml;
	//Re-display output list
	document.getElementById("output").innerHTML = outputhtml;
}
