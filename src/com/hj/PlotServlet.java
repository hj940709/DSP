package com.hj;

import java.io.File;
import java.io.IOException;
import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class PlotServlet
 */
@WebServlet("/PlotServlet")
public class PlotServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String equation = request.getParameter("equation");
		String coefficient = new SinParser(equation).getCoefficient();
		String path = getServletContext().getRealPath("/");
		try {
			// from -pi to pi with step size pi/40 (0.0785398163397)
			//Execute r.sh or command line
			//r.sh :Rcript -e "jpeg('$filepath');plot(seq(-pi,pi,pi/40),$a*seq(-pi,pi,pi/40),main='y=$equation',type='l');dev.off()";
			//Plotting to a jpeg figure
			String os = System.getProperties().getProperty("os.name");
			os = os.split(" ")[0];
			switch(os){
			case "Windows":
				path = path.replace("\\", "/");
				new ProcessBuilder("Rscript","-e","\"jpeg('"+path+"Rplot.jpeg"+"');"
						+ "plot(seq(-pi,pi,pi/40),"+coefficient+"*sin(seq(-pi,pi,pi/40))"+
						",main='y="+equation+"',xlab='X',ylab='Y',type='l');\"").start().waitFor();
				break;
				
			case "Linux":
				new ProcessBuilder(path+"r.sh",	path+"Rplot.jpeg",coefficient,equation).start().waitFor();
				break;
			}
			//Output and send the figure to client
			ImageIO.write(ImageIO.read(new File(path+"Rplot.jpeg")),
					"jpeg", response.getOutputStream());
			response.flushBuffer();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
