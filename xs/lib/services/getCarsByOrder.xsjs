//services/getOrderByCar.xsjs?carId=1000000001
$.import("config","properties");
$.import("utils","requestUtil");
$.import("utils","dbUtil");
var orderId = $.request.parameters.get("orderId");
if(!orderId){
	throw "Parameter orderId is not specified or has incorrect value, please check and try again.";
}

var connection = $.xs.dbUtil.getConnection();
var statement = 'SELECT "carId" FROM "main.OrdersToCars" WHERE "orderId" = ?';
var result = connection.executeQuery(statement, parseInt(orderId, 10));

var carId = result[0].carId;
var url = $.xs.properties.get("iot.apiUrl") + "/getCarLocation.xsjs";
var request = new $.net.http.Request($.net.http.GET, "/");
if(carId){
	request.parameters.push({name:"carId",value:carId});
}
var client = new $.net.http.Client();
client.request(request, url);
var response = client.getResponse();
if (response.body) {
	cars = JSON.parse(response.body.asString());
	if (cars.length > 0) {
		//{"CARID":"gpsCar","C_LONGITUDE":53.90757000000001,"C_LATITUDE":27.627530000000004,"C_ORDERID":1000000001,"C_TIMESTAMP":"2018-06-27T12:43:16.000Z"}
		var carsIds = cars.map(function(car) {
			return car.CARID;
		});
		var connection = $.xs.dbUtil.getConnection();
		var statement = 'SELECT * FROM "main.Car" WHERE "carId" in (' + (new Array(carsIds.length)).fill('?') + ')';
		var result = connection.executeQuery.apply(connection, [statement].concat(carsIds));
		var response = [];
		for (var i = 0; i < result.length; i++) {
			var car = JSON.parse(JSON.stringify(result[i]));
			car.status = car["status.status"];
			delete  car["status.status"];
			cars.forEach(function(carPosition) {
				if (car.carId === carPosition.CARID) {
					car.location = carPosition.C_LONGITUDE + ";" + carPosition.C_LATITUDE + ";0";
				}
			});
			response.push(car);
		}
		cars = response;
	}
}
// var connection = $.xs.dbUtil.getConnection();
$.xs.requestUtil.prepareResponse({
	"results": [{
		"id": "54463d412cb4e449",
		"status": "A",
		"licPlate": "1876 MP-7",
		"name": "Камаз",
		"model": "53213",
		"VIN": "1143d412cb4eе67",
		"avgSpeed": "30.00"
	}]
});