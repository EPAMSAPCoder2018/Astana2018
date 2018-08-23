//services/getCarsCurrentPositions.xsjs?carId=1000000001&orderId=1000006
$.import("config", "properties");
$.import("utils", "requestUtil");
$.import("utils", "dbUtil");
var carId = $.request.parameters.get("carId");
var orderId = $.request.parameters.get("orderId");
if(orderId){
	var connection = $.xs.dbUtil.getConnection();
	var statement = 'SELECT "carId" FROM "main.OrdersToCars" WHERE "orderId" = ?';
	var result = connection.executeQuery(statement, parseInt(orderId, 10));
	
	carId = result[0].carId;
}
var url = $.xs.properties.get("iot.apiUrl") + "/getCarLocation.xsjs";
var request = new $.net.http.Request($.net.http.GET, "/");
if(carId){
	request.parameters.push({name:"carId",value:carId});
}
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
		//carsIds = ["54463d412cb4e449"];
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
$.xs.requestUtil.prepareResponse({
	results: cars
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