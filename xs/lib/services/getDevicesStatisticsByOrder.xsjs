//services/getDevicesStatisticsByOrder.xsjs?carId=1000000001&orderId=1000003
$.import("config", "properties");
$.import("utils", "requestUtil");
$.import("utils", "dbUtil");
var carId = $.request.parameters.get("carId");
var orderId = $.request.parameters.get("orderId");
var withStatistics = $.request.parameters.get("withStatistics") === "true";
var url = $.xs.properties.get("iot.apiUrl") + "/getCoordinates.xsjs";
var request = new $.net.http.Request($.net.http.GET, "/");
var connection = $.xs.dbUtil.getConnection();

if (carId) {
	request.parameters.push({
		name: "carId",
		value: carId
	});
}
if (orderId) {
	request.parameters.push({
		name: "orderId",
		value: orderId
	});
}
var client = new $.net.http.Client();
client.request(request, url);
var response = client.getResponse();
var coordinates = [];

var gpsName = "GPS";
var spreaderName = "SALT_SPREADER";
var snowplowName = "SNOWPLOW";
var brushName = "BRUSH";
var result = {};
var statistics = {};
var coordinatesTemp = {};
coordinatesTemp[gpsName] = [];
coordinatesTemp[spreaderName] = [];
coordinatesTemp[snowplowName] = [];
coordinatesTemp[brushName] = [];
result[gpsName] = [];
result[spreaderName] = [];
result[snowplowName] = [];
result[brushName] = [];
statistics[gpsName] = 0;
statistics[spreaderName] = 0;
statistics[snowplowName] = 0;
statistics[brushName] = 0;
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
		response.forEach(function (coordinate) {
			switch (coordinate.OPERATION) {
			case "START":
				result[coordinate.DEVICETYPE].push(coordinate);
				break;
			case "INPROCESS":
				result[coordinate.DEVICETYPE].push($.xs.dbUtil.clone(coordinate));
				if (result[spreaderName].length > 0) {
					coordinate.DEVICETYPE = spreaderName;
					result[spreaderName].push($.xs.dbUtil.clone(coordinate));
				}
				if (result[snowplowName].length > 0) {
					coordinate.DEVICETYPE = snowplowName;
					result[snowplowName].push($.xs.dbUtil.clone(coordinate));
				}
				if (result[brushName].length > 0) {
					coordinate.DEVICETYPE = brushName;
					result[brushName].push($.xs.dbUtil.clone(coordinate));
				}
				break;
			case "STOP":
				result[coordinate.DEVICETYPE].push(coordinate);
				// coordinates.push(result[coordinate.DEVICETYPE]);
				coordinatesTemp[coordinate.DEVICETYPE].push(result[coordinate.DEVICETYPE]);
				result[coordinate.DEVICETYPE] = [];
				if (coordinate.DEVICETYPE === gpsName) {
					if (result[spreaderName].length > 0) {
						// coordinates.push(result[spreaderName]);
						coordinatesTemp[spreaderName].push(result[spreaderName]);
					}
					if (result[snowplowName].length > 0) {
						// coordinates.push(result[snowplowName]);
						coordinatesTemp[snowplowName].push(result[snowplowName]);
					}
					if (result[brushName].length > 0) {
						// coordinates.push(result[brushName]);
						coordinatesTemp[brushName].push(result[brushName]);
					}
				}
				break;
			}
		});
		if (result[gpsName].length > 0) {
			coordinatesTemp[gpsName].push(result[gpsName]);
		}
		if (result[spreaderName].length > 0) {
			coordinatesTemp[spreaderName].push(result[spreaderName]);
		}
		if (result[snowplowName].length > 0) {
			coordinatesTemp[snowplowName].push(result[snowplowName]);
		}
		if (result[brushName].length > 0) {
			coordinatesTemp[brushName].push(result[brushName]);
		}
		coordinates = coordinates.concat(coordinatesTemp[gpsName]);
		coordinates = coordinates.concat(coordinatesTemp[snowplowName]);
		coordinates = coordinates.concat(coordinatesTemp[brushName]);
		coordinates = coordinates.concat(coordinatesTemp[spreaderName]);
		var calculateDistanceFromCoordinates = connection.loadProcedure("calculateDistanceFromCoordinates");
		response = coordinates.map(function (coordinate) {
			var resItem = {
				coordinates: []
			};
			coordinate.forEach(function (item) {
				resItem.coordinates.push(item.C_LONGITUDE + ";" + item.C_LATITUDE + ";0");
				resItem.orderId = item.C_ORDERID;
				resItem.carId = item.CARID;
				resItem.status = item.DEVICETYPE;
			});
			if(withStatistics){
				var points = coordinate.map(function (item) {
					return {
						"LONG": item.C_LONGITUDE,
						"LAT": item.C_LATITUDE
					};
				});
				resItem.distance = calculateDistanceFromCoordinates(points).EV_DISTANCE;
				statistics[resItem.status] = statistics[resItem.status] + parseFloat(resItem.distance);
			}
			resItem.coordinates = resItem.coordinates.join(";");
			return resItem;
		});

	}
}

$.xs.requestUtil.prepareResponse({
	results : response,
	statistics : statistics
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