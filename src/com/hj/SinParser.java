package com.hj;

public class SinParser {
	private double coefficient;
	public SinParser(String equation){
		String str_coefficient = this.parse(equation.split("sin")[0]);
		if(str_coefficient.endsWith("*")){
			str_coefficient = 
					str_coefficient.substring(0, str_coefficient.length()-1);
		}
		this.coefficient = Double.valueOf(str_coefficient);
	}
	public String getCoefficient() {
		return coefficient+"";
	}
	private String parse(String equation){
		String[] array = this.substract(equation);
		String result = array[0];
		while(!array[2].isEmpty()){
			String arg1 = array[0];
			String op = array[1];
			String[] temp = substract(array[2]);
			String arg2 = temp[0];
			if(!arg2.equals("sin(x)"))
				result = new SimpleCalculator(arg1,arg2,op).getResult()+"";
			else{
				result = result+temp[1]+temp[2];
				break;
			}
			array = substract(result+temp[1]+temp[2]);
		}
		return result;
	}
	
	private String[] substract(String str){
		int offset = 0;//for negative result or input
		char[] c_array = str.toCharArray();
		if(c_array[0]=='-')
			offset = 1;
		for(int i=offset;i<c_array.length;i++){
			if(c_array[i]=='+'||c_array[i]=='-'||
					c_array[i]=='*'||c_array[i]=='/'){
				return new String[]{String.valueOf(c_array, 0, i),c_array[i]+""
						,String.valueOf(c_array, i+1, c_array.length-i-1)};
			}	
		}
		return new String[]{str,"",""};
	}
}
