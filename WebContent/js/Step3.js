function calculate(){
	var outputhtml = "";
	//var equation = $("#equation").val();
	var equation = document.getElementById("equation").value.toLocaleLowerCase();
	var array = substract(equation);
	var result = array[0];
	while(array[2]!=""){
		var arg1 = array[0];
		var op = array[1];
		var temp = substract(array[2]);
		var arg2 = temp[0];
		
		if(arg2=="sin(x)"){
			result = arg1+op+arg2;
			break;
		}
		if(result!=null){
			if(op=="+") op="%2B";
			result = submitSimCal(arg1,arg2,op,true);
		}
		//Adding output node
		outputhtml += "<tr><td>"+arg1+array[1]+arg2+" = "+result+"</td></tr>";
		if(result == "Infinity") break;
		//if(result="Error")
		array = substract(result+temp[1]+temp[2]);
	}
	if(result.search(/sin\(x\)/)==-1){
		//Show the result
		alert(equation+"="+result);
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
	else{
		var coefficient = "1";
		if (substract(result)[0]!="sin(x)")
			coefficient = substract(result)[0];
		var sin = getSinTable(true);
		var data = [];
		for(var i=0;i<sin.length;i++){
			m = submitSimCal(coefficient,sin[i][1].toString(),"*",true);
			data.push([sin[i][0],m]);
		}
		$("#plot").height(9*$("#plot").width()/16);
		$("#plot").html("<canvas/>");
		plotInCanvas(data,"y="+equation);
	}
	//Reset the form
	//$("#equation").val("");
	document.getElementById("equation").value="";	
}

function getSimplified(){
	var outputhtml = "";
	//var equation = $("#equation").val();
	var equation = document.getElementById("equation").value;
	var array = substract(equation);
	var arg1 = array[0];
	var op = array[1];
	var temp = substract(array[2]);
	var arg2 = temp[0];
	var result = simplify(arg1,arg2,op);
	if(result!=null)
		document.getElementById("equation").value=result+temp[1]+temp[2];
}

function changeCacheSize(){
	var n_cacheSize=document.getElementById("cachesize").value;
	var cache = JSON.parse(sessionStorage.cache);
	while(n_cacheSize<cache.length)
		cache.pop();
	sessionStorage.cache = JSON.stringify(cache);
	sessionStorage.cacheSize = n_cacheSize;
}