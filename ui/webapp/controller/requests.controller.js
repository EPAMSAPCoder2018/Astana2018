sap.ui.define([
	"com/epam/ui/controller/base.controller",
	'sap/m/Text',
	"com/epam/ui/model/models"
], function (BaseController, Text, Models) {
	"use strict";
	return BaseController.extend("com.epam.ui.controller.technics", {
		onInit: function () {
			BaseController.prototype.onInit.apply(this, arguments);
			var mapDataModel = Models.createMapDataModel();
			mapDataModel.setData({
				spots: []
			});
			this.getView().setModel(Models.createRequestFiltersModel(), "requestsFiltersModel");
			this.getView().setModel(mapDataModel, "mapData");
			this._mapDataLoadingTask = this.createPeriodicalyTask(function () {
				$.ajax({
					type: "GET",
					url: "/services/getCustomersRequests.xsjs",
					async: false,
					success: function (data, textStatus, jqXHR) {
						var statuses = {
							"Done": "Success",
							"In process": "Warning",
							"Open": "Error"
						};
						data.result.forEach(function (spot, index) {
							spot.index = index + 1;
							spot.status = statuses[spot["requestStatus"]];
						});
						mapDataModel.setProperty("/spots", data.result);
					},
					error: function (data, textStatus, jqXHR) {
						alert("error to post " + textStatus);
					}
				});
			}, 5000);
		},

		onLegendItemClick: function (evt) {
			var oMap = this.getMapControl();
			var crmRequest = evt.getSource().getBindingContext("mapData").getProperty();
			oMap.setCenterPosition(crmRequest.location.replace("; 0", ""));
			oMap.setZoomlevel(15);
		},

		onRS: function (evt) {
			var oModel = this.getView().getModel();
			var lons = [];
			var lats = [];

			if (lons.length && lats.length) {
				if (lons.length == 1 && lats.length == 1) {
					this.oVBI.zoomToGeoPosition(lons, lats, 5);
				} else {
					this.oVBI.zoomToGeoPosition(lons, lats);
				}
			}
		},

		onFiltersChanged: function (evt) {
			var oMap = this.getMapControl();
			var oMapLegend = this.getMapLegend();
			var binding = oMap.getAggregation("vos")[0].getBinding("items");
			var key = evt.getParameters().selectedItem.getKey();
			oMap.setCenterPosition("27.554899;53.904651");
			oMap.setZoomlevel(12);
			if (key === "All") {
				oMapLegend.getBinding("items").filter([]);
				binding.filter([]);
			} else {
				var oFilterStatus = new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, key);
				oMapLegend.getBinding("items").filter([oFilterStatus]);
				binding.filter([oFilterStatus]);
			}
		},

		onHideView: function (evt) {
			this._mapDataLoadingTask.stop();
		},

		onAfterRendering: function () {
			BaseController.prototype.onAfterRendering.apply(this, arguments);
			this._mapDataLoadingTask.start();
		},

		onSpotClickItem: function (evt) {
			var that = this;
			var pos = {};
			var position = evt.getParameters().data.Action.Params.Param.forEach(function (param) {
				pos[param.name] = param["#"];
			});
			var marker = document.getElementById(that.getView().byId("SpotDetailPointer").getId());
			marker.style.position = "absolute";
			marker.style.width = "1px";
			marker.style.left = pos.x + "px";
			marker.style.top = pos.y + "px";
			var oMap = this.getMapControl();
			if (!that._oPopover) {
				that._oPopover = sap.ui.xmlfragment("com.epam.ui.view.fragment.requestDetails", that);
				that.getView().addDependent(that._oPopover);
			}
			that._oPopover.bindElement({
				path: evt.getSource().getBindingContext("mapData").getPath(),
				model: "mapData"
			});
			that._oPopover.setPlacement("PreferredRightOrFlip");

			setTimeout(function () {
				that._oPopover.openBy(that._spotDetailPointer);
			}, 1);
		}

	});
});