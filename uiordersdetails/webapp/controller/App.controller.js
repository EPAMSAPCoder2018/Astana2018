sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/epam/uiordersdetails/util/utils",
	"com/epam/uiordersdetails/model/models"
], function (Controller, Utils, models) {
	"use strict";

	return Controller.extend("com.epam.uiordersdetails.controller.App", {
		onInit: function () {
			var that = this;
			var component = that.getOwnerComponent();
			if(!component.getModel()){
				component.setModel(models.createEmptyJSONModel());
			}
			var i18n = component.getModel("i18n");
			this._ordersLoadingTask = Utils.createPeriodicalyTask(function () {
				$.ajax({
					type: "GET",
					url: "/services/getOrders.xsjs",
					async: false,
					success: function (data, textStatus, jqXHR) {
						var STATUSES_MAPPING = {
							"I": {
								color: "rgb(240,255,0)",
								state: "Warning",
								description: i18n.getProperty("order.status.I")
							},
							"D": {
								color: "rgb(0,255,0)",
								state: "Success",
								description: i18n.getProperty("order.status.D")
							},
							"P": {
								color: "rgb(152,152,152)",
								state: "None",
								description: i18n.getProperty("order.status.P")
							}
						};
						data.results.forEach(function (order, i) {
							order.index = i;
							order.state = STATUSES_MAPPING[order.status];
						});
						component.getModel().setData(data);
					},
					error: function (data, textStatus, jqXHR) {
						console.log("Error to post ", textStatus, data, jqXHR);
					}
				});
			}, 15000);
			this._ordersLoadingTask.start();
		}
	});
});