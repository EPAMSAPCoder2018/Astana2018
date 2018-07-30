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
					oXhr.respondJSON(200, {}, JSON.stringify(getData("getAllOrders.json")));
					return true;
				}
			},{
				method: "GET",
				path: new RegExp("getOrder\.xsjs\\?orderId=(.*)"),
				response: function (oXhr, orderId) {
					var orderId = parseInt(orderId);
					var data = getData("getAllOrders.json").results;
					var order = null;
					data.forEach(function(orderItem){
						if(orderItem.id === orderId){
							order = orderItem;
						}
					});
					oXhr.respondJSON(200, {}, JSON.stringify(order));
					return true;
				}
			}, {
				method: "GET",
				path: new RegExp("getAllCarsByOrder\.xsjs\\?orderId=(.*)"),
				response: function (oXhr) {
					var orderId = parseInt(orderId);
					var data = getData("getAllCars.json");
					oXhr.respondJSON(200, {}, JSON.stringify(data));
					return true;
				}
			}, {
				method: "GET",
				path: new RegExp("getAllStages\.xsjs\\?orderId=(.*)"),
				response: function (oXhr, orderId) {
					var orderId = parseInt(orderId);
					var data = getData("getAllStages.json");
					oXhr.respondJSON(200, {}, JSON.stringify(data[orderId]));
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
			}, {
				method: "GET",
				path: new RegExp("getDevicesStatisticsByOrder\.xsjs\\?orderId=(.*)"),
				response: function (oXhr, orderId) {
					oXhr.respondJSON(200, {}, JSON.stringify(getData("getDevicesStatisticsByOrder.json")[orderId]));
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