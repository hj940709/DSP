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

function factorial(n,caching){
	//factorial(n)
	var result = "1";
	for(var i=1;i<=n;i++)
		result = submitSimCal(result,i.toString(),"*",caching);
	return result;
}

function power(x,n,caching){
	//x^n->power(x,n)
	var result = x.toString();
	if(n==0) return "1";
	for(var i=1;i<n;i++)
		result = submitSimCal(result,x.toString(),"*",caching);
	return result;
}

function getSin(x,caching){
	//Approximately,
	//sin(x)=
	// power(-1,0)/factorial(1)*power(x,1)+
	// power(-1,1)/factorial(3)*power(x,3)+
	// ...power(-1,n)/factorial(2n+1)*power(x,2n+1)
	var result = "0";
	for(var n=0;n<7;n++){
		var a = power("-1",n,caching);//power(-1,n)
		var b = submitSimCal("2",n.toString(),"*",caching);//2n
		b = submitSimCal(b,"1","%2B",caching); //2n+1
		b = Number.parseFloat(b);
		var c = factorial(b,caching); //factorial(2n+1)
		var d = power(x,b,caching); //power(x,2n+1)
		//power(-1,n)/factorial(2n+1)
		var temp = submitSimCal(a,c,"/",caching); 
		//power(-1,n)/factorial(2n+1)*power(x,2n+1)
		temp = submitSimCal(temp,d,"*",caching); 
		//sum(power(-1,n)/factorial(2n+1)*power(x,2n+1))
		result = submitSimCal(result,temp,"%2B",caching);
	}
	return result;
}

function getSinTable(caching){
	var sin = [];
	var step = submitSimCal(Math.PI.toString(),"40","/",caching);
	for(var x=-Math.PI;x<=Math.PI;){
		var sinx = getSin(x.toString(),caching);
		sin.push([x,sinx]);
		x = Number.parseFloat(submitSimCal(x.toString(),step,"%2B",caching))//x+=step
	}
	return sin;
}