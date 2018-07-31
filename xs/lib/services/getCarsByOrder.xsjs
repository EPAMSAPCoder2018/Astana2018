//services/getOrderByCar.xsjs?carId=1000000001
$.import("config","properties");
$.import("utils","requestUtil");
$.import("utils","dbUtil");
var orderId = $.request.parameters.get("orderId");
if(!orderId){
	throw "Parameter orderId is not specified or has incorrect value, please check and try again.";
}
// var connection = $.xs.dbUtil.getConnection();
$.xs.requestUtil.prepareResponse({
	"results": [{
		"id": "54463d412cb4e449",
		"status": "A",
		"licPlate": "1876 MP-7",
		"name": "Камаз",
		"model": "53213",
		"VIN": "1143d412cb4eе67",
		"avgSpeed": "30.00"
	}]
});