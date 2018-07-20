//services/updateOrderStatusByID.xsjs?orderId=1000005&status=I
$.import("config", "properties");
$.import("utils", "requestUtil");
$.import("utils", "dbUtil");
var orderId = $.request.parameters.get("orderId");
var status = $.request.parameters.get("status");
if (!orderId) {
	throw "Parameter orderId is not specified or has incorrect value, please check and try again.";
};
if (!status) {
	throw "Parameter status is not specified or has incorrect value, please check and try again.";
};

var connection = $.xs.dbUtil.getConnection();
var setStatus = connection.loadProcedure("setStatus4Order");
try {
	setStatus(orderId, status);	
	$.response.status = $.net.http.OK;
} catch (e) {
    $.response.contentType = "application/json; charset=UTF-8";
	$.response.setBody(e.message);
	$.response.status = $.net.http.BAD_REQUEST;
}