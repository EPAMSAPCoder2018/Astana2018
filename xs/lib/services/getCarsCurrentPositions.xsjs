//https://z3szxawch1ksmlwe-astana-xs.cfapps.eu10.hana.ondemand.com/services/getCarsCurrentPositions.xsjs?carId=1000000001 
$.import("config", "properties");
$.import("utils", "requestUtil");
$.import("utils", "dbUtil");
var carId = $.request.parameters.get("carId");
var requestParameters = {
	carId: carId
};
var iotApiUrl = $.xs.properties.get("iot.apiUrl") + "/getCarLocation.xsjs";
var url = $.xs.requestUtil.prepareUrl(iotApiUrl, requestParameters);
var request = new $.net.http.Request($.net.http.GET, "/");
var client = new $.net.http.Client();
client.request(request, url);
var response = client.getResponse();
var cars = [];
if (response.body) {
	cars = JSON.parse(response.body.asString());
	if (cars.length > 0) {
		//{"CARID":"gpsCar","C_LONGITUDE":53.90757000000001,"C_LATITUDE":27.627530000000004,"C_ORDERID":1000000001,"C_TIMESTAMP":"2018-06-27T12:43:16.000Z"}
		var carsIds = cars.map(function(car) {
			return car.CARID;
		});
		carsIds = ["54463d412cb4e449"];
		var connection = $.xs.dbUtil.getConnection();
		var statement = 'SELECT * FROM "main.Car" WHERE "carId" in (' + (new Array(carsIds.length)).fill('?') + ')';
		var result = connection.executeQuery.apply(connection, [statement].concat(carsIds));
		var response = [];
		for (var i = 0; i < result.length; i++) {
			var car = JSON.parse(JSON.stringify(result[i]));
			cars.forEach(function(carPosition) {
				if (car.carId === carPosition.CARID) {
					car.location = carPosition.C_LONGITUDE + " " + carPosition.C_LATITUDE + " 0";
				}
			});
			response.push(car);
		}
		cars = response;
	}
}
$.xs.requestUtil.prepareResponse({
	result: cars
});
//EXAMPLE
/*{
	"result": [{
		"carId": "54463d412cb4e449",
		"status.status": "A",
		"licPlate": "",
		"carName": "MAZ",
		"carModel": "5449",
		"VIN": "VIN54463d412cb4e449",
		"avgSpeed": "30.00",
		"location": "53.90757000000001 27.627530000000004 0"
	}]
}*/