//https://z3szxawch1ksmlwe-astana-xs.cfapps.eu10.hana.ondemand.com/services/generateVectorsByOrder.xsjs?orderId=1000000001
$.import("config","properties");
$.import("utils","requestUtil");
$.import("utils","dbUtil");
var Polyline = $.require('google-polyline');

var googleApiKey = $.xs.properties.get("google.apiKey");
var googleApiUrl = $.xs.properties.get("google.apiUrl");

var request = new $.net.http.Request($.net.http.GET, "/");
var client = new $.net.http.Client();
var orderId = $.request.parameters.get("orderId");
if(!orderId){
	throw "Parameter orderId is not specified or has incorrect value, please check and try again.";
}
var connection = $.xs.dbUtil.getConnection();
var getStages = connection.loadProcedure("getStages");
var stages = getStages(orderId).RESULT;

var vectors = [];
var stagesIds = [];

for(var i=0; i < stages.length; i++){
	var row = stages[i];
	var stage = {
		stageId : row.stageId,
		geoFrom : JSON.parse(row.geoFrom).coordinates.reverse().join(","),
		geoTo : JSON.parse(row.geoTo).coordinates.reverse().join(",")
	};
	stagesIds.push(row.stageId);
	stage.vector = getVectorByStage(stage, client, request);
	vectors.push(stage);
}

var insertVactorsStatement = 'INSERT INTO "main.Vectors"("stageId", "coordinates") VALUES(?, new ST_MultiPoint(?))';
var deleteVactorsStatement = 'DELETE FROM "main.Vectors" WHERE "stageId" IN (' + (new Array(stagesIds.length)).fill('?') + ')';
var argsArray = [];
vectors.forEach(function(vector){
	argsArray.push({stageId:vector.stageId, vector:'MultiPoint Z((' + vector.vector.join("),(") + '))'});
});
connection.executeUpdate.apply(connection, [deleteVactorsStatement].concat(stagesIds));
var addVectorsProc = connection.loadProcedure("addVectors");
addVectorsProc(argsArray);
connection.commit();

$.xs.requestUtil.prepareResponse({addedVectors: vectors});

function getVectorByStage(stage, client, request){
	var requestParameters = {
		origin : stage.geoFrom,
		destination : stage.geoTo,
		key : googleApiKey,
		mode : "driving"
	};
	var url = $.xs.requestUtil.prepareUrl(googleApiUrl, requestParameters);
	client.request(request, url);
	var response = client.getResponse();
	var vector = [];
	if(response.body){
		var body = JSON.parse(response.body.asString());
	    vector = Polyline.decode(body.routes[0]["overview_polyline"].points);
	    vector = vector.map(function(point){
	    	point = point.reverse();
	    	point.push(0);
	    	return point.join(" ");
	    });
	}
	return vector;
} 