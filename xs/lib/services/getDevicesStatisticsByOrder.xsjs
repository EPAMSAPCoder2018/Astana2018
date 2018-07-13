//services/getDevicesStatisticsByOrder.xsjs?carId=1000000001&orderId=1000003
$.import("config", "properties");
$.import("utils", "requestUtil");
$.import("utils", "dbUtil");
var carId = $.request.parameters.get("carId");
var orderId = $.request.parameters.get("orderId");
var url = $.xs.properties.get("iot.apiUrl") + "/getCoordinates.xsjs";
var request = new $.net.http.Request($.net.http.GET, "/");
if(carId){
	request.parameters.push({name:"carId",value:carId});
}
if(orderId){
	request.parameters.push({name:"orderId",value:orderId});
}
var client = new $.net.http.Client();
client.request(request, url);
var response = client.getResponse();
var coordinates = [];
if (response.body) {
	response = JSON.parse(response.body.asString());
	if (response.length > 0) {
		/*{
			"CARID": "54463d412cb4e449",
			"C_LONGITUDE": 27.670639991760254,
			"C_LATITUDE": 53.92399978637695,
			"C_ORDERID": 1000003,
			"C_TIMESTAMP": "2018-07-11T11:27:24.000Z",
			"OPERATION": "STOP"
		}*/
		var gpsName = "GPS";
		var spreaderName = "SALT_SPREADER";
		var snowplowName = "SNOWPLOW";
		var brushName = "BRUSH";
		var result = {};
		result[gpsName]	= [];
		result[spreaderName] = [];
		result[snowplowName] = [];
		result[brushName] = [];
		response.forEach(function(coordinate){
			switch(coordinate.OPERATION){
				case "START":
					result[coordinate.DEVICETYPE].push(coordinate);
					break;
				case "INPROCESS":
					result[coordinate.DEVICETYPE].push($.xs.dbUtil.clone(coordinate));
					if(result[spreaderName].length > 0){
						coordinate.DEVICETYPE = spreaderName;
						result[spreaderName].push($.xs.dbUtil.clone(coordinate));
					}
					if(result[snowplowName].length > 0){
						coordinate.DEVICETYPE = snowplowName;
						result[snowplowName].push($.xs.dbUtil.clone(coordinate));
					}
					if(result[brushName].length > 0){
						coordinate.DEVICETYPE = brushName;
						result[brushName].push($.xs.dbUtil.clone(coordinate));
					}
					break;
				case "STOP":
					result[coordinate.DEVICETYPE].push(coordinate);
					coordinates.push(result[coordinate.DEVICETYPE]);
					result[coordinate.DEVICETYPE] = [];
					if(coordinate.DEVICETYPE === gpsName){
						if(result[spreaderName].length > 0){
							coordinates.push(result[spreaderName]);
						}
						if(result[snowplowName].length > 0){
							coordinates.push(result[snowplowName]);
						}
						if(result[brushName].length > 0){
							coordinates.push(result[brushName]);
						}
					}
					break;
			}
		});
		response = coordinates.map(function(coordinate){
			var resItem = {
				vector : {
					coordinates : []
				}
			};
			coordinate.forEach(function(item){
				resItem.vector.coordinates.push(item.C_LONGITUDE + ";" + item.C_LATITUDE + ";0");
				resItem.orderId = item.C_ORDERID;
				resItem.carId = item.CARID;
				resItem.status = item.DEVICETYPE;
			});
			resItem.vector.coordinates = resItem.vector.coordinates.join(";");
			return resItem;
		});
		
	}
}
$.xs.requestUtil.prepareResponse({
	results: response
});
//EXAMPLE
/*{
	"stageId": 2000008,
	"geoFrom": "53.924642,27.678896",
	"geoTo": "53.926409,27.659173",
	"status": "P",
	"geoFromName": "Scientific Center of Surgery",
	"geoToName": "Beltransgaz",
	"vector": {
		"vectorId": 3000076,
		"coordinates": "27.678930282592773;53.92463970184326;0;27.678589820861816;53.92446994781494;0;27.678279876708984;53.924360275268555;0;27.67786979675293;53.92422962188721;0;27.677330017089844;53.924099922180176;0;27.675589561462402;53.92387008666992;0;27.674500465393066;53.92372989654541;0;27.673660278320312;53.92368030548096;0;27.673069953918457;53.92368030548096;0;27.672189712524414;53.92372989654541;0;27.671719551086426;53.923789978027344;0;27.670639991760254;53.92399978637695;0;27.66837978363037;53.924489974975586;0;27.665940284729004;53.92502021789551;0;27.66182041168213;53.92591953277588;0;27.660369873046875;53.92625045776367;0;27.65915012359619;53.926509857177734;0;27.659099578857422;53.926429748535156;0;27.6591796875;53.92642021179199;0"
	}
}*/
/*{
	"CARID": "54463d412cb4e449",
	"DEVICETYPE": "SALT_SPREADER",
	"C_LONGITUDE": 27.66182041168213,
	"C_LATITUDE": 53.92591953277588,
	"C_ORDERID": 1000003,
	"C_TIMESTAMP": "2018-07-12T07:42:37.000Z",
	"OPERATION": "STOP"
}*/