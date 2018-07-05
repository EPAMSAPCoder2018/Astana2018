//https://z3szxawch1ksmlwe-astana-xs.cfapps.eu10.hana.ondemand.com/services/getCarsCurrentPositions.xsjs?carId=1000000001 
$.import("config", "properties");
$.import("utils", "requestUtil");
$.import("utils", "dbUtil");


var connection = $.xs.dbUtil.getConnection();
var statement = 'SELECT TOP 5 "custName", "custSurName", "phone", "address" FROM "crm.Customers" ORDER BY ROW_NUMBER() OVER (ORDER BY RAND())';
var customers = connection.executeQuery(statement);

var statement = 'SELECT TOP 5 "requestDate", "requestStatus" FROM "crm.Requests" ORDER BY ROW_NUMBER() OVER (ORDER BY RAND())';
var requests = connection.executeQuery(statement);

var statement = 'SELECT TOP 5 "problem", "description" FROM "crm.Details" ORDER BY ROW_NUMBER() OVER (ORDER BY RAND())';
var details = connection.executeQuery(statement);

//var statement = 'SELECT TOP 5 "longtitude", "latitude" FROM "crm.Points" ORDER BY ROW_NUMBER() OVER (ORDER BY RAND())';
var statement = 'SELECT TOP 5 concat(concat(concat("longtitude", \'; \'), "latitude"), \'; 0\') as "location" FROM "crm.Points" ORDER BY ROW_NUMBER() OVER (ORDER BY RAND())';
var points = connection.executeQuery(statement);

var response = [];

for (var i = 0; i < 5; i++) { //result.length
	var req = Object.assign(requests[i], details[i], customers[i], points[i]);
	response.push(JSON.parse(JSON.stringify(req)));
}

$.xs.requestUtil.prepareResponse({
	result: response
});
