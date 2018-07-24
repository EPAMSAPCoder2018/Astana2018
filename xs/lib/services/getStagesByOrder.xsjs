//services/getStagesByOrder.xsjs?orderId=1000000001
$.import("config", "properties");
$.import("utils", "dbUtil");

var orderId = $.request.parameters.get("orderId");
if(!orderId){
	throw {
		message: 'Validation Error! Parameter orderId is not specified.'
	};
}

var connection = $.xs.dbUtil.getConnection();
var getStages = connection.loadProcedure("getFullStages");
var stages = getStages(orderId).RESULT;

var result = [];
for (var i = 0; i < stages.length; i++) {
	result.push(stages[i]);
}
$.xs.requestUtil.prepareResponse({
	results: result
});