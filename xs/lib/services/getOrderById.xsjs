//services/getOrderByCar.xsjs?carId=1000000001
$.import("config","properties");
$.import("utils","requestUtil");
$.import("utils","dbUtil");
var orderId = $.request.parameters.get("orderId");
if(!orderId){
	throw "Parameter orderId is not specified or has incorrect value, please check and try again.";
}
var connection = $.xs.dbUtil.getConnection();
$.xs.requestUtil.prepareResponse({});