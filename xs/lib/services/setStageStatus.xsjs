//services/setStageStatus.xsjs?orderId=1000001
$.import("config", "properties");
$.import("utils", "requestUtil");
$.import("utils", "dbUtil");

var orderId = $.request.parameters.get("orderId");
var connection = $.xs.dbUtil.getConnection();
var statement = 'SELECT "carId" FROM "main.OrdersToCars" WHERE "orderId" = ?';
var result = connection.executeQuery(statement, parseInt(orderId, 10));

var carId = result[0].carId;
if (!carId) {
	throw {
		message: 'Car is not assigned to the orderd'
	};
}

var url = $.xs.properties.get("iot.apiUrl") + "/getCarLocation.xsjs";
var request = new $.net.http.Request($.net.http.GET, "/");
if (carId) {
	request.parameters.push({
		name: "carId",
		value: carId
	});
}
var client = new $.net.http.Client();
client.request(request, url);
var response = client.getResponse();
var res = [];
if (response.body) {
	var body = JSON.parse(response.body.asString());
	for (var i = 0; i < body.length; i++) {
		res.push(body[i]);
	}
}

var changeStageStatus = connection.loadProcedure("changeStageStatus");
var isChanged = changeStageStatus(res[0].C_LATITUDE, res[0].C_LONGITUDE, orderId);
if (!isChanged.EV_RESULT) {
	$.response.contentType = "application/json; charset=UTF-8";
	$.response.setBody("All the stages are up to date");
	$.response.status = $.net.http.OK;
} else {
	$.response.contentType = "application/json; charset=UTF-8";
	$.response.setBody(isChanged.EV_RESULT + ' stage(s) updated');
	$.response.status = $.net.http.OK;
}
