//https://z3szxawch1ksmlwe-astana-xs.cfapps.eu10.hana.ondemand.com/services/registerCar.xsjs?carId=54463d412cb4e449 
$.import("config", "properties");
$.import("utils", "requestUtil");
$.import("utils", "dbUtil");
var carId = $.request.parameters.get("carId");
var requestParameters = {
	carId: carId
};
//https://iots0019634792trial.hanatrial.ondemand.com/iot/xsjs/registerCar.xsjs?carId=54463d412cb4e449
var iotApiUrl = $.xs.properties.get("iot.apiUrl") + "/registerCar.xsjs";
var url = $.xs.requestUtil.prepareUrl(iotApiUrl, requestParameters);
var request = new $.net.http.Request($.net.http.GET, "/");
var client = new $.net.http.Client();
client.request(request, url);
var response = client.getResponse();
var cars = [];
if (response.body) {
	car = JSON.parse(response.body.asString());
	if (cars.isNewlyRegistered) {
		
		//{"CARID":"gpsCar","C_LONGITUDE":53.90757000000001,"C_LATITUDE":27.627530000000004,"C_ORDERID":1000000001,"C_TIMESTAMP":"2018-06-27T12:43:16.000Z"}
		var carParams = [carId, 'A', 'LIC 876', 'MAZ', '5449', 'VIN54463d412cb4e449', '30'];
		var connection = $.xs.dbUtil.getConnection();
		// INSERT INTO "main.Car" VALUES(
		// 	'54463d412cb4e449',--/*carId <NVARCHAR(50)>*/,
		// 	'A',--/*status.status <NVARCHAR(1)>*/, 
		// 	'',--/*licPlate <NVARCHAR(7)>*/,
		// 	'MAZ',--/*carName <NVARCHAR(50)>*/,
		// 	'5449',--/*carModel <NVARCHAR(50)>*/,
		// 	'VIN54463d412cb4e449',--/*VIN <NVARCHAR(16)>*/,
		// 	30--/*avgSpeed <DECIMAL>*/
		// );
		var statement = 'INSERT INTO "main.Car" VALUES(' + (new Array(carParams.length)).fill('?') + ')';
		var result = connection.executeQuery.apply(connection, [statement].concat(carParams));
	}
	
	$.xs.requestUtil.prepareResponse({
		results : car
	});
}
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