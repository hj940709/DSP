function calculate(){
	var outputhtml = "";
	//var equation = $("#equation").val();
	var equation = document.getElementById("equation").value.toLocaleLowerCase();
	var plot = false; //decide whether it eventually will plot or calculate
	if(equation.endsWith("*sin(x)")){
		equation = equation.substr(0,equation.length-7);
		plot = true;
	}
	if(equation=="sin(x)"){
		equation = "1"; //sin(x)=1*sin(x)
		plot = true;
	}
	//check for cached item recursively
	var simplified = replace(equation);
	var flag = simplified;
	while(flag!=simplified){
		flag = simplified;
		simplified = replace(simplified);
	}
	//submit
	var main = resolve(simplified);
	var result = main[0];
	while(main[2]!=""){
		var arg1 = main[0];
		var op = main[1];
		var secondary = resolve(main[2]);
		var arg2 = secondary[0];
		if(op=="+") op="%2B";
		
		result = submitSimCal(arg1,arg2,op,true);
		//Adding output node
		outputhtml += "<tr><td>"+arg1+main[1]+arg2+" = "+result+"</td></tr>";
		//break when getting infinity
		if(result == "Infinity") break;
		
		//check for cached item again
		simplified = replace(result+secondary[1]+secondary[2]);
		flag = simplified;
		while(flag!=simplified){
			flag = simplified;
			simplified = replace(simplified);
		}
		
		main = resolve(simplified);
	}
	if(!plot){
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
		var sin = getSinTable(true); //get sin table
		var data = [];
		if(result="Infinity") result="9999" //set an upper bound for infinity
		for(var i=0;i<sin.length;i++){
			//get coordinate for plot
			m = submitSimCal(result,sin[i][1].toString(),"*",true);
			data.push([sin[i][0],m]);
		}
		$("#plot").height(9*$("#plot").width()/16);
		$("#plot").html("<canvas/>");
		plotInCanvas(data,"y="+document.getElementById("equation").value);
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
	if(main[2]=="") return equation; //a single number
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