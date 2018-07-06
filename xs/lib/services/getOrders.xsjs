//services/getOrders.xsjs
$.import("config","properties");
$.import("utils","requestUtil");
$.import("utils","dbUtil");

var connection = $.xs.dbUtil.getConnection();
var getFullOrders = connection.loadProcedure("getFullOrders");
var result = getFullOrders().RESULT;
var response = {};

for(var i=0; i < result.length; i++){
	var row = result[i];
	var order = response[row.orderId] || {stages:[],car:{}};

	order.orderId = row.orderId;
	order.status = row.orderStatus;
	order.orderDate = row.orderDate;
	order.car.carId = row.carId;
	order.car.status = row.carStatus;
	order.car.licPlate = row.licPlate;
	order.car.carName = row.carName;
	order.car.carModel = row.carModel;
	order.car.VIN = row.VIN;
	order.car.avgSpeed = row.avgSpeed;
	var stage = {
		stageId : row.stageId,
		geoFrom : JSON.parse(row.geoFrom).coordinates.reverse().join(","),
		geoTo : JSON.parse(row.geoTo).coordinates.reverse().join(","),
		status : row.stageStatus,
		geoFromName : row.geoFromName,
		geoToName : row.geoToName,
		vector : {
			vectorId : row.vectorId,
			coordinates : JSON.parse(row.coordinates).coordinates.map(function(point){
			    return point.join(";");
			}).join(";")
		}
	};
	order.stages.push(stage);
	response[row.orderId] = order;
}
var res = Object.keys(response).map(function(orderId){
	return response[orderId];
});

$.xs.requestUtil.prepareResponse({results: res});