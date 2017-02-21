window.onload=function(){
	//initial local storage for cache and history if they are null
	if(sessionStorage.cacheSize==null)
		sessionStorage.cacheSize=10;//Cache size is 10 by default
	if(sessionStorage.cache==null)
		sessionStorage.cache=JSON.stringify([]);
	if(sessionStorage.history==null)
		sessionStorage.history=JSON.stringify([]);
	else{
		//Display history if it is not empty
		var historyArray = JSON.parse(sessionStorage.history);
		html = "";
		for(var i = 0;i<historyArray.length;i++){
			html += "<tr><td>"+historyArray[i]+"</td></tr>";
		}
		//$("#history").html(html);
		if(document.getElementById("history")!=null)
			document.getElementById("history").innerHTML = html;
	}
	if(document.getElementById("cachesize")!=null)
		document.getElementById("cachesize").value = sessionStorage.cacheSize;
}
function httpGet(url,data)
{
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url+"?"+data, false ); 
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText);
}


function submitSimCal(arg1,arg2,op,caching){
	//atomic submittion, caching and returning result;
	var result = null;
	if(caching){
		result = simplify(arg1,arg2,op);
	}
	if(result!=null) return result;
	var data = "arg1="+arg1+"&arg2="+arg2+"&op="+op;
	
	//submit atomic operation to server
	/*$.ajax({
		   type: "GET",
		   url: "./SimCalServlet",
		   async: false,
		   data: data,
		   dataType: "json",
		   success: function(data){
		       result = data["result"];
		   }
		});*/
	result = httpGet("./SimCalServlet",data)["result"];
	if(caching){
		//caching returned result
		var cache = JSON.parse(sessionStorage.cache);
		var t_op = op;
		if(t_op == "%2B") t_op = "+";
		if(!arg1.includes('.')) arg1 += ".0"; //formalize 
		if(!arg2.includes('.')) arg2 += ".0"; //formalize
		cache.unshift([arg1+t_op+arg2,result]);
		if(cache.length>=sessionStorage.cacheSize)
			cache.pop();
		sessionStorage.cache = JSON.stringify(cache);
	}
	return result;
}

function localCal(arg1,arg2,op){
	var n_arg1 = Number.parseFloat(arg1);
	var n_arg2 = Number.parseFloat(arg2);
	switch(op){
	case "+":
	case "%2B":
		return n_arg1+n_arg2;
		break;
		
	case "-":
		return n_arg1-n_arg2;
		break;
		
	case "*":
		return n_arg1*n_arg2;
		break;
		
	case "/":
		return n_arg1/n_arg2;
		break;
	}
}

function substract(str){
	//separate the first number from string
	//separate the first operation from string
	//return number, operation and remaining
	var patt = /[+,\-,\*,\/]/;
	var offset = 0;//for negative result or input
	if(str.charAt(0)=="-")
		offset = 1;
	var op = str.substring(offset).match(patt);
	if(op!=null)
		return [str.substring(0,op.index+offset),op[0],str.substring(op.index+1+offset)];
	else
		return [str,"",""];	
}

function simplify(arg1,arg2,op){
	var cache = JSON.parse(sessionStorage.cache);
	var t_arg1 = arg1;
	var t_arg2 = arg2;
	if(!t_arg1.includes('.')) t_arg1 += ".0"; //formalize 
	if(!t_arg2.includes('.')) t_arg2 += ".0"; //formalize 
	for(var i=0;i<cache.length;i++){
		if(cache[i][0]==t_arg1+op+t_arg2)
			return cache[i][1];
		if((op=="+"||op=="*")&&cache[i][0]==t_arg2+op+t_arg1)
			return cache[i][1];
	}
	return null;
}