package com.hj;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class BasicServlet
 */
@WebServlet("/BasicServlet")
public class BasicServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		//response.getWriter().append("Served at: ").append(request.getContextPath());
		String arg1 = (String)request.getParameter("arg1");
		String op = (String)request.getParameter("op");
		String arg2 = (String)request.getParameter("arg2");
		double result = new SimpleCalculator(arg1,arg2,op).getResult();
		response.sendRedirect("./Index.jsp?arg1="+arg1+"&arg2="+arg2+"&op="+op+"&result="+result);
	}


}
