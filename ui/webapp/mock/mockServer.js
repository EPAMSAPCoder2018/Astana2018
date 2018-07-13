sap.ui.define([
	'sap/ui/core/util/MockServer'
], function (MockServer) {
	"use strict";
	var getData = function (fileName) {
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.loadData("mock/data/" + fileName, undefined, false);
		return oModel.getData();
	};
	return {
		getInstance: function () {
			var requests = [{
				method: "GET",
				path: new RegExp("getOrders\.xsjs"),
				response: function (oXhr) {
					oXhr.respondJSON(200, {}, JSON.stringify(getData("getOrders.json")));
					return true;
				}
			}, {
				method: "GET",
				path: new RegExp("getCustomersRequests\.xsjs"),
				response: function (oXhr) {
					oXhr.respondJSON(200, {}, JSON.stringify(getData("getCustomersRequests.json")));
					return true;
				}
			}, {
				method: "GET",
				path: new RegExp("getCarsCurrentPositions\.xsjs"),
				response: function (oXhr) {
					oXhr.respondJSON(200, {}, JSON.stringify(getData("getCarsCurrentPositions.json")));
					return true;
				}
			},{
				method: "GET",
				path: new RegExp("getDevicesStatisticsByOrder\.xsjs\\?orderId=(.*)"),
				response: function (oXhr, orderId) {
					oXhr.respondJSON(200, {}, JSON.stringify(getData("getDevicesStatisticsByOrder.json")));
					return true;
				}
			}];
			var oMockServer = new MockServer({
				rootUri: "/services/",
				requests: requests
			});
			return oMockServer;
		}
	};
});