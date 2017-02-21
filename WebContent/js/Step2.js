$(document).ready(function(){
	$(".nav-pills>li>a").click(function(){
		$(".nav-pills>li").removeClass("active");
		$(this).parent().addClass("active");
		$("#plot").html("<p>Empty</p>");
		$("#equation").val("");
		switch($(".nav-pills>li>a").index($(this)))
		{
		case 0:
			$("#submit").attr("onClick","server()");
			break;
			
		case 1:
			$("#submit").attr("onClick","client()");
			break;
			
		case 2:
			$("#submit").attr("onClick","hybrid()");
			break;
		}
	});
	$("#plot").height(9*$("#plot").width()/16);
});

function server(){
	var equation = $("#equation").val().replace(/\+/g,"%2B").toLocaleLowerCase();
	$("#plot").html("<img src=\"./PlotServlet?equation="+equation+"\" />");
}

function client(){
	var equation = $("#equation").val().toLocaleLowerCase();
	$("#plot").html("<canvas/>");
	var array = substract(equation);
	var result = array[0];
	while(array[2]!=""){
		var arg1 = array[0];
		var op = array[1];
		var temp = substract(array[2]);
		var arg2 = temp[0];
		if(op=="+") op="%2B";

		if(arg2=="sin(x)") break;
		
		result = localCal(arg1,arg2,op);
		
		if(result == "Infinity") break;
		
		
		array = substract(result+temp[1]+temp[2]);
	}
	var data = [];
	for(var i=-Math.PI;i<Math.PI;i+=Math.PI/40){
		m = localCal(result,Math.sin(i).toString(),"*");
		data.push([i,m]);
	}	
	plotInCanvas(data,"y="+equation);
}

function hybrid(){
	//approximation table of 1*sin(x) from -pi to pi with step size pi/40(0.0785398163397)
	//format : [x,sin(x)]
	var sin = getSinTable(false);
	var equation = $("#equation").val().toLocaleLowerCase();
	$("#plot").html("<canvas/>");
	var array = substract(equation);
	var result = array[0];
	while(array[2]!=""){
		var arg1 = array[0];
		var op = array[1];
		var temp = substract(array[2]);
		var arg2 = temp[0];
		if(op=="+") op="%2B";

		if(arg2=="sin(x)") break;
		
		result = submitSimCal(arg1,arg2,op,false);
		
		if(result == "Infinity") break;
		
		
		array = substract(result+temp[1]+temp[2]);
	}
	var data = [];
	if(result=="sin(x)") result = "1";
	for(var i=0;i<sin.length;i++){
		m = submitSimCal(result,sin[i][1],"*",false,false);
		data.push([sin[i][0],m]);
	}	
	plotInCanvas(data,"y="+equation);
}