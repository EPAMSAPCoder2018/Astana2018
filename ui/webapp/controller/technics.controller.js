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
				spots : []
			});
			this.getView().setModel(Models.createTechnicFiltersModel.apply(this), "technicsFiltersModel");
			this.getView().setModel(mapDataModel, "mapData");
			this._mapDataLoadingTask = this.createPeriodicalyTask(function () {
				$.ajax({
					type: "GET",
					url: "/services/getCarsCurrentPositions.xsjs",
					async: false,
					success: function (data, textStatus, jqXHR) {
						var statuses = {
							N: "Warning",
							A: "Success",
							B: "Error"
						};
						data.results.forEach(function (spot, index) {
							spot.index = index + 1;
							spot.status = statuses[spot["status"]];
						});
						mapDataModel.setProperty("/spots", data.results);
					},
					error: function (data, textStatus, jqXHR) {
						alert("error to post " + textStatus);
					}
				});
			}, 5000);
		},

		onHideView: function (evt) {
			this._mapDataLoadingTask.stop();
		},
		
		onAfterRendering: function () {
			BaseController.prototype.onAfterRendering.apply(this, arguments);
			this._mapDataLoadingTask.start();
		},

		onLegendItemClick: function (evt) {
			var oMap = this.getMapControl();
			var car = evt.getSource().getBindingContext("mapData").getProperty();
			oMap.setCenterPosition(car.location.replace(";0", ""));
			oMap.setZoomlevel(15);
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
				that._oPopover = sap.ui.xmlfragment("com.epam.ui.view.fragment.carDetails", that);
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
		},

		handleEmailPress: function (oEvent) {
			this._oPopover.close();
			MessageToast.show("E-Mail has been sent");
		}
	});
});