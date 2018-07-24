//services/getOrders.xsjs
$.import("config", "properties");
$.import("utils", "requestUtil");
$.import("utils", "dbUtil");

var connection = $.xs.dbUtil.getConnection();
var getFullOrders = connection.loadProcedure("getFullOrders");
var result = getFullOrders().RESULT;
var response = {};

for (var i = 0; i < result.length; i++) {
	var row = result[i];
	var order = response[row.orderId] || {
		stages: [],
		geoFromName: [],
		geoToName: [],
		coordinates: [],
		description: ""
	};

	order.id = row.orderId;
	order.status = row.orderStatus;
	order.createDate = row.orderDate;
	order.carId = row.carId;
	order.coordinates = order.coordinates.concat(JSON.parse(row.coordinates).coordinates.map(function (point) {
		return point.join(";");
	}));
	order.geoToName.push(row.geoToName);
	order.geoFromName.push(row.geoFromName);
	order.stages.push(row.stageId);
	response[row.orderId] = order;
}
var res = Object.keys(response).map(function (orderId) {
	var order = response[orderId];
	order.coordinates = order.coordinates.join(";");
	order.description = order.geoFromName[0] + " - " + order.geoToName.reverse()[0];
	delete order.geoFromName;
	delete order.geoToName;
	return order;
});

$.xs.requestUtil.prepareResponse({
	results: res
});