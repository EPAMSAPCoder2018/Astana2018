//services/generateVectorsByOrder.xsjs?orderId=1000000001
$.import("config", "properties");
$.import("utils", "requestUtil");
$.import("utils", "dbUtil");
var Polyline = $.require('google-polyline');

var googleApiKey = $.xs.properties.get("google.apiKey");
var googleApiUrl = $.xs.properties.get("google.apiUrl");

var request = new $.net.http.Request($.net.http.GET, "/");
var client = new $.net.http.Client();
var orderId = $.request.parameters.get("orderId") || null;

var connection = $.xs.dbUtil.getConnection();
var getStages = connection.loadProcedure("getStages");
var stages = getStages(orderId).RESULT;

var vectors = [];
var stagesIds = [];
var ordersForUpdate = {};
var stagesForUpdate = [];

for (var i = 0; i < stages.length; i++) {
	var row = stages[i];
	var stage = {
		stageId: row.stageId,
		geoFrom: JSON.parse(row.geoFrom).coordinates.reverse().join(","),
		geoTo: JSON.parse(row.geoTo).coordinates.reverse().join(",")
	};
	stagesIds.push(row.stageId);
	var data = getVectorByStage(stage, client, request);
	stage.vector = data.vector;
	
	if(!ordersForUpdate[row.orderId]){
		ordersForUpdate[row.orderId] = {
			orderId : row.orderId,
			distance : 0
		};
	}
	ordersForUpdate[row.orderId].distance = ordersForUpdate[row.orderId].distance + data.distance;
	stagesForUpdate.push([data.distance, data.geoFromName, data.geoToName, row.stageId]);
	vectors.push(stage);
}

var insertVactorsStatement = 'INSERT INTO "main.Vectors"("stageId", "coordinates") VALUES(?, new ST_LineString(?))';
var deleteVactorsStatement = 'DELETE FROM "main.Vectors" WHERE "stageId" IN (' + (new Array(stagesIds.length)).fill('?') + ')';
var updateStagesStatement = 'UPDATE "main.Stages" SET "distance"=?, "geoFromName"=?, "geoToName"=?  WHERE "stageId"=?';
var updateOrdersStatement = 'UPDATE "main.Orders" SET "distance"=? WHERE "orderId"=?';
var argsArray = [];
vectors.forEach(function(vector){
	argsArray.push({stageId:vector.stageId, vector:'LineString Z(' + vector.vector.join(", ") + ')'});
});
var orders = [];
for(var orderId in ordersForUpdate){
	orders.push([ordersForUpdate[orderId].distance, orderId]);
}
ordersForUpdate
connection.executeUpdate.apply(connection, [deleteVactorsStatement].concat(stagesIds));
connection.executeUpdate.apply(connection, [updateStagesStatement, stagesForUpdate]);
connection.executeUpdate.apply(connection, [updateOrdersStatement, orders]);
var addVectorsProc = connection.loadProcedure("addVectors");
addVectorsProc(argsArray);
connection.commit();

$.xs.requestUtil.prepareResponse({
	addedVectors: vectors,
	updatedOrders : orders,
	updatedStages : stagesForUpdate
});

function getVectorByStage(stage, client, request) {
	var requestParameters = {
		origin: stage.geoFrom,
		destination: stage.geoTo,
		key: googleApiKey,
		mode: "driving",
		language: "ru"
	};
	var url = $.xs.requestUtil.prepareUrl(googleApiUrl, requestParameters);
	// request.parameters.push({name:"origin",value:stage.geoFrom});
	// request.parameters.push({name:"destination",value:stage.geoTo});
	// request.parameters.push({name:"key",value:googleApiKey});
	// request.parameters.push({name:"mode",value:"driving"});
	request.headers.push({name:"Accept-Language",value:"ru"})
	client.request(request, url);
	var response = client.getResponse();
	var data = {
		distance : 0,
		geoFromName : null,
		geoToName : null,
		vector: []
	};
	if (response.body) {
		var body = JSON.parse(response.body.asString());
		var vector = Polyline.decode(body.routes[0]["overview_polyline"].points);
		data.vector = vector.map(function (point) {
			point = point.reverse();
			point.push(0);
			return point.join(" ");
		});
		data.distance = body.routes[0].legs[0].distance.value;
		data.geoToName = body.routes[0].legs[0].end_address;
		data.geoToName = data.geoToName.substr(0, data.geoToName.indexOf(","));
		data.geoFromName = body.routes[0].legs[0].start_address;
		data.geoFromName = data.geoFromName.substr(0, data.geoFromName.indexOf(","));
	}
	return data;
}