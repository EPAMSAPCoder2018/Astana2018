sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/Device",
	"com/epam/uiordersdetails/model/models",
	"com/epam/uiordersdetails/controller/base.controller"
], function (Controller, Device, Models, BaseController) {
	"use strict";
	var STATUSES_MAPPING = {
		I: "rgb(240,255,0)",
		D: "rgb(0,255,0)",
		P: "rgb(152,152,152)",
		GPS: "rgb(0,255,0)",
		SNOWPLOW: "rgb(0,128,255)",
		SALT_SPREADER: "rgb(255,0,255)",
		BRUSH: "rgb(255,128,0)"
	};
	return BaseController.extend("com.epam.uiordersdetails.controller.Master", {

		onInit: function () {
			var oList = this.byId("list");
			this._oList = oList;
			var that = this;
			// var model = Models.createEmptyJSONModel().setData({
			// 	results: []
			// });
			var oRouter = this.getRouter();
			oRouter.getRoute("master").attachPatternMatched(this._onMasterMatched, this);
			oRouter.attachBypassed(this.onBypassed, this);

			// this._mapDataLoadingTask = this.createPeriodicalyTask(function () {
			// $.ajax({
			// 	type: "GET",
			// 	url: "/services/getOrders.xsjs",
			// 	async: false,
			// 	success: function (data, textStatus, jqXHR) {
			// 		data.results.forEach(function (order, i) {
			// 			order.index = i;
			// 			order.color = STATUSES_MAPPING[order.status];
			// 			order.isOrder = true;
			// 		});
			// 		model.setData(data);
			// 	},
			// 	error: function (data, textStatus, jqXHR) {
			// 		alert("error to post " + textStatus);
			// 	}
			// });
			// that.getOwnerComponent().setModel(model);
			// }, 20000);
			// this._mapDataLoadingTask.start();
			that.getOwnerComponent().oListSelector.setBoundMasterList(oList);
		},
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},
		onSelect: function (e) {
			this._showDetail(e.getParameter("listItem") || e.getSource());
		},
		_showDetail: function (oItem) {
			this.getRouter().navTo("object", {
				objectId: oItem.getBindingContext().getProperty("id"),
				index: oItem.getBindingContext().getProperty("index"),
			}, true);
		},
		onBypassed: function () {
			this._oList.removeSelections(true);
		},
		_onMasterMatched: function (e) {
			this.getOwnerComponent().oListSelector.oWhenListLoadingIsDone.then(function (mParams) {
				if (mParams.list.getMode() === "None") {
					return;
				}
				var sObjectId = mParams.firstListItem.getProperty("id");
				var index = mParams.firstListItem.getProperty("index");
				this.getRouter().navTo("object", {
					objectId: sObjectId,
					index: index
				}, true);
			}.bind(this));
		}
	});

});