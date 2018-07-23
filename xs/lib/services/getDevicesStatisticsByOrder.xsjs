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
	"CARID": "54463d412cb4e449",
	"DEVICETYPE": "SALT_SPREADER",
	"C_LONGITUDE": 27.66182041168213,
	"C_LATITUDE": 53.92591953277588,
	"C_ORDERID": 1000003,
	"C_TIMESTAMP": "2018-07-12T07:42:37.000Z",
	"OPERATION": "STOP"
}*/