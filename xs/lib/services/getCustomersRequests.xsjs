//services/getCustomerRequests.xsjs?orderId=1000001&requestId=7
$.import("config", "properties");
$.import("utils", "requestUtil");
$.import("utils", "dbUtil");

var connection = $.xs.dbUtil.getConnection();
var orderId = $.request.parameters.get("orderId");
var requestId = $.request.parameters.get("requestId");
var subSelect = 'SELECT * FROM "crm.Requests"';
if (orderId) {
	subSelect =
		'SELECT REQ.* FROM "crm.RequestsToOrders" RTO INNER JOIN "crm.Requests" REQ ON REQ."requestId"=RTO."requestId" WHERE RTO."orderId"=' +
		orderId;
}
if (requestId) {
	subSelect =
		'SELECT REQ.* FROM "crm.Requests" REQ WHERE REQ."requestId"=' + requestId;
}
var statement =
	'SELECT ' +
	'REQ."requestId" "id", ' +
	'TO_DATE(REQ."createDate") as "createDate", ' +
	'REQ."status", concat(concat(concat(PNT."longtitude", \'; \'), ' +
	'PNT."latitude"), \'; 0\') as "location", ' +
	'CUST."custName", ' +
	'CUST."custSurName", ' +
	'CUST."phone", ' +
	'CUST."address", ' +
	'DET."problem", ' +
	'DET."description" ' +
	'FROM (' + subSelect + ') REQ ' +
	'INNER JOIN "crm.Customers" CUST ON REQ."customerId" = CUST."customerId" ' +
	'INNER JOIN "crm.Details" DET ON REQ."detailsId" = DET."detailId" ' +
	'INNER JOIN "crm.Points" PNT ON REQ."customerId" = PNT."pointId" ';
var requests = connection.executeQuery(statement);
var response = [];

for (var i = 0; i < requests.length; i++) { //result.length
	var req = requests[i];
	response.push(req);
}

$.xs.requestUtil.prepareResponse({
	result: response
});