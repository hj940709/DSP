package com.hj;

public class SimpleCalculator {
	private float arg1;
	private float arg2;
	private String op;
	private float result;

	public SimpleCalculator(String arg1, String arg2, String op){
		//for atomic operation
		this.arg1 = Float.valueOf(arg1);
		this.arg2 = Float.valueOf(arg2);
		this.op = op;
	}
	public float getX() {
		return arg1;
	}
	public void setX(float x) {
		this.arg1 = x;
	}
	public float getY() {
		return arg2;
	}
	public void setY(float y) {
		this.arg2 = y;
	}
	public String getOperator() {
		return op;
	}
	public void setOperator(String operator) {
		this.op = operator;
	}
	public float getResult() {
		switch(this.op){
		case "%2B":
		case "+":
			this.result = this.arg1+this.arg2;
			break;
		case "-":
			this.result = this.arg1-this.arg2;
			break;
		case "*":
			this.result = this.arg1*this.arg2;
			break;
		case "/":
			this.result = this.arg1/this.arg2;
			break;
		}
		return this.result;
	}
}
