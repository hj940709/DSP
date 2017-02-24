function calculate(){
	var outputhtml = "";
	//var equation = $("#equation").val();
	var equation = document.getElementById("equation").value.toLocaleLowerCase();
	//check for cached item recursively
	var simplified = replace(equation);
	var flag = simplified;
	while(flag!=simplified){
		flag = simplified;
		simplified = replace(simplified);
	}
	//submit
	var array = resolve(simplified);
	var result = "";
	while(array[2]!=""){
		var arg1 = array[0];
		var op = array[1];
		var temp = resolve(array[2]);
		var arg2 = temp[0];
		if(op=="+") op="%2B";
		//stop operating when meet sin
		if(arg2=="sin(x)"){
			result = arg1+op+arg2;
			break;
		}
		
		result = submitSimCal(arg1,arg2,op,false);
		//Adding output node
		outputhtml += "<tr><td>"+arg1+array[1]+arg2+" = "+result+"</td></tr>";
		//break when getting infinity
		if(result == "Infinity") break;
		
		//check for cached item again
		simplified = replace(result+temp[1]+temp[2]);
		flag = simplified;
		while(flag!=simplified){
			flag = simplified;
			simplified = replace(simplified);
		}
		
		array = resolve(simplified);
	}
	if(result.search(/sin\(x\)/)==-1){
		//Show the result for non-sin expression
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
		//plot for the expression with sin
		var coefficient = "1"; //default coefficient 1
		if (resolve(result)[0]!="sin(x)")
			coefficient = resolve(result)[0]; //set coefficient
		var sin = getSinTable(true); //get sin table
		var data = [];
		for(var i=0;i<sin.length;i++){
			//get coordinate for plot
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
	//replace the cached item once
	var outputhtml = "";
	//var equation = $("#equation").val();
	var equation = document.getElementById("equation").value;
	equation = replace(equation);
	document.getElementById("equation").value=equation;	
}
function replace(equation){
	//scan and replace
	//from left to right
	var flag = false;
	var main = resolve(equation);
	var arg1 = main[0];
	var op = main[1];
	var simplified = "";
	if(main[2]=="") simplified=equation;
	while(main[2]!=""){
		var secondary = resolve(main[2]);
		var arg2 = secondary[0];
		//call for check
		var rep = simplify(arg1,arg2,op);
		if(rep!=null){
			//replace if get hit
			//resolving from further string
			simplified += rep+secondary[1];
			main = resolve(secondary[2]);
		}
		else{
			//continue if not hit
			//resolving from the next number
			simplified += arg1+op;
			main = resolve(main[2]);
		}		
		arg1 = main[0];
		op = main[1];
	}
	simplified += arg1;
	return simplified;
}

function changeCacheSize(){
	//change cache size
	//FIFO
	var n_cacheSize=document.getElementById("cachesize").value;
	var cache = JSON.parse(sessionStorage.cache);
	while(n_cacheSize<cache.length)
		cache.pop();
	sessionStorage.cache = JSON.stringify(cache);
	sessionStorage.cacheSize = n_cacheSize;
}

//function getSimplified(){
//	var outputhtml = "";
//	//var equation = $("#equation").val();
//	var equation = document.getElementById("equation").value;
//	var array = substract(equation);
//	var arg1 = array[0];
//	var op = array[1];
//	var temp = substract(array[2]);
//	var arg2 = temp[0];
//	var result = simplify(arg1,arg2,op);
//	if(result!=null)
//		document.getElementById("equation").value=result+temp[1]+temp[2];
//}