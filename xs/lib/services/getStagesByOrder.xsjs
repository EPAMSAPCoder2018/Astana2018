//services/getStagesByOrder.xsjs?orderId=1000000001
$.import("config", "properties");
$.import("utils", "requestUtil");
$.import("utils", "dbUtil");

var orderId = $.request.parameters.get("orderId");
if (!orderId) {
	throw {
		message: 'Validation Error! Parameter orderId is not specified.'
	};
}

var connection = $.xs.dbUtil.getConnection();
var getStages = connection.loadProcedure("getFullStages");
var stages = getStages(orderId).RESULT;

var result = [];
for (var i = 0; i < stages.length; i++) {
	var stage = JSON.parse(JSON.stringify(stages[i]));
	stage.geoFrom = JSON.parse(stage.geoFrom).coordinates.reverse().join(",");
	stage.geoTo = JSON.parse(stage.geoTo).coordinates.reverse().join(",");
	stage.coordinates = JSON.parse(stage.coordinates).coordinates.map(function (point) {
		return point.join(";");
	}).join(";");
	result.push(stage);
}
$.xs.requestUtil.prepareResponse({
	results: result
});