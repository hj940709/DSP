<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<script src="./js/Calculator.js" type="text/javascript"></script>
		<link rel="stylesheet" href="./css/bootstrap.css">
		<link rel="stylesheet" href="./css/bootstrap-theme.css">
		<link href="./css/Index.css" type="text/css" rel="stylesheet" />
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta name="description" content="DSP">
		<meta name="author" content="hj">
		<title>Distributed System Project</title>
	</head>
	<body>
		<script type="text/javascript">
			var result = "<%=request.getParameter("result") %>";
			var arg1 = "<%=request.getParameter("arg1") %>";
			var arg2 = "<%=request.getParameter("arg2") %>";
			var op = "<%=request.getParameter("op") %>";
			if(result!="null"&&arg1!="null"&&arg2!="null"&&op!="null"){
				alert(arg1+op+arg2+"="+result);
				var cache = JSON.parse(sessionStorage.cache);
				if(op == "%2B") op = "+";
				
				var historyArray = JSON.parse(sessionStorage.history);
				historyArray.unshift(arg1+op+arg2+" = "+result);
				sessionStorage.history = JSON.stringify(historyArray);
				html = "";
				for(var i = 0;i<historyArray.length;i++){
					html += "<tr><td>"+historyArray[i]+"</td></tr>";
				}
				//$("#history").html(html);
				document.getElementById("history").innerHTML = html;
				
				if(!arg1.includes('.')) arg1 += ".0"; //formalize 
				if(!arg2.includes('.')) arg2 += ".0"; //formalize
				cache.unshift([arg1+op+arg2,result]);
				if(cache.length>=sessionStorage.cacheSize)
					cache.pop();
				sessionStorage.cache = JSON.stringify(cache);
			}
		</script>
		<div class="container-fluid">
			<div class="row-fluid">
				<div class="span12">
					<h2 style="text-align:left">
						Distributed System Project
					</h2>
					<h3>
						- by Hou, Jue
					</h3>
					<ul class="nav nav-tabs">
						<li class="active">
							<a href="./Index.jsp">Simple Calculator</a>
						</li>
						<li>
							<a href="./Step1.html">Step 1</a>
						</li>
						<li>
							<a href="./Step2.html">Step 2</a>
						</li>
						<li>
							<a href="./Step3.html">Step 3</a>
						</li>
					</ul>
				</div>
			</div>
			<div class="row-fluid" style="margin-top:50px" >
				<div class="span12">
					<div class="row-fluid">
						<div class="span12">
							<div class="form-inline">
								<form class="form-group" action="./BasicServlet" method="get"><!-- form -->
									<input type="number" class="form-control" name="arg1" placeHolder="arg1"/>
									<select class="form-control" name="op">
										<option value="%2B">+</option><!-- encoded "+",%2B==+ -->
										<option value="-">-</option>
										<option value="*">*</option>
										<option value="/">/</option>
									</select>
									<input type="number" class="form-control" name="arg2" placeHolder="arg2"/>
									<button type="submit" class="btn btn-primary" >Calculate</button>
								</div>
							</div>
						</div>
						<div class="span12">
							<table class="table table-hover">
								<thead>
									<tr>
										<th>Histroy</th>
									</tr>
								</thead>
								<tbody id="history" style="text-align:left">
									<!--  <tr><td>1+2=3</td></tr>  -->
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>