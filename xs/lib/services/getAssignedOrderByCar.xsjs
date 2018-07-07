//services/getAssignedOrderByCar.xsjs?carId=54463d412cb4e449
$.import("config","properties");
$.import("utils","requestUtil");
$.import("utils","dbUtil");
var carId = $.request.parameters.get("carId");
if(!carId){
	throw "Parameter carId is not specified or has incorrect value, please check and try again.";
}
var connection = $.xs.dbUtil.getConnection();
var getFullOrderByCar = connection.loadProcedure("getFullOrderByCar");
var result = getFullOrderByCar(carId).RESULT;

var order = {
	stages:[],
	car:{}
};

for(var i=0; i < result.length; i++){
	var row = result[i];
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
}

$.xs.requestUtil.prepareResponse({result: order});