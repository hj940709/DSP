function calculate(){
	var outputhtml = "";
	//var equation = $("#equation").val();
	var equation = document.getElementById("equation").value;
	var array = substract(equation);
	var result = "";
	while(array[2]!=""){
		var arg1 = array[0];
		var op = array[1];
		var temp = substract(array[2]);
		var arg2 = temp[0];
		if(op=="+") op="%2B";
		result = submitSimCal(arg1,arg2,op,false,false);
		//Adding output node
		outputhtml += "<tr><td>"+arg1+array[1]+arg2+" = "+result+"</td></tr>";
		if(result == "Infinity") break;
		//if(result="Error")
		array = substract(result+temp[1]+temp[2]);
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
