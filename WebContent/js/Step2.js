$(document).ready(function(){
	$(".nav-pills>li>a").click(function(){
		//display effect switch
		$(".nav-pills>li").removeClass("active");
		$(this).parent().addClass("active");
		$("#plot").html("<p>Empty</p>");
		$("#equation").val("");
		switch($(".nav-pills>li>a").index($(this)))
		{
		// functionality switch
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
	//automatically adapt the size of plot container
	$("#plot").height(9*$("#plot").width()/16);
});

function server(){
	//call for image from server
	var equation = $("#equation").val().replace(/\+/g,"%2B").toLocaleLowerCase();
	//add image
	$("#plot").html("<img src=\"./PlotServlet?equation="+equation+"\" />");
}

function client(){
	// parse the line and calculate
	var equation = $("#equation").val().toLocaleLowerCase();
	//add canvas label
	$("#plot").html("<canvas/>");
	//calculate from left to right
	var main = resolve(equation);
	var result = main[0];
	while(main[2]!=""){
		var arg1 = main[0];
		var op = main[1];
		var secondary = resolve(main[2]);
		var arg2 = secondary[0];
		if(op=="+") op="%2B";
		//stop operating when meet sin
		if(arg2=="sin(x)") break;
		//submit to local
		result = localCal(arg1,arg2,op);
		//stop operating when getting Infinity
		if(result == "Infinity") break;
		main = resolve(result+secondary[1]+secondary[2]);
	}
	//plot
	var data = [];
	if(result=="sin(x)") result = "1";
	for(var i=-Math.PI;i<Math.PI;i+=Math.PI/40){
		m = localCal(result,Math.sin(i).toString(),"*");
		data.push([i,m]);
	}	
	plotInCanvas(data,"y="+equation);
}

function hybrid(){
	//approximation table of 1*sin(x) from -pi to pi with step size pi/40(0.0785398163397)
	var equation = $("#equation").val().toLocaleLowerCase();
	//add canvas label
	$("#plot").html("<canvas/>");
	//parse the line
	var main = resolve(equation);
	var result = main[0];
	while(main[2]!=""){
		var arg1 = main[0];
		var op = main[1];
		var secondray = resolve(main[2]);
		var arg2 = secondray[0];
		if(op=="+") op="%2B";
		//stop operating when meet sin
		if(arg2=="sin(x)") break;
		//submit to server
		result = submitSimCal(arg1,arg2,op,false);
		//stop operating when getting Infinity
		if(result == "Infinity") break;
		
		main = resolve(result+secondray[1]+secondray[2]);
	}
	if(result=="sin(x)") result = "1";
	//format : [x,sin(x)]
	var data = getSinTable(false);
	for(var i=0;i<data.length;i++){
		//get coordinate for plot
		data[i][1] = submitSimCal(result,data[i][1],"*",false);
	}
	plotInCanvas(data,"y="+equation);
}