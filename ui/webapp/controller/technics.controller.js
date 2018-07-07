sap.ui.define([
	"com/epam/ui/controller/base.controller",
	"sap/ui/model/json/JSONModel",
	'sap/m/Text',
	"com/epam/ui/model/models"
], function(BaseController, JSONModel, Text, Models) {
	"use strict";
	return BaseController.extend("com.epam.ui.controller.technics", {
		onInit: function() {
			BaseController.prototype.onInit.apply(this, arguments);
			this.getView().setModel(Models.createTechnicFiltersModel(), "technicsFiltersModel");
			var mapDataModel = Models.createMapDataModel();
			this.getView().setModel(mapDataModel, "mapData");
			// $.ajax({
			// 	type: "GET",
			// 	url: "/services/getCarsCurrentPositions.xsjs",
			// 	async: false,
			// 	success: function(data, textStatus, jqXHR) {
			var data = {
				"results": [{
					"carId": "54463d412cb4e449",
					"status.status": "A",
					"licPlate": "",
					"carName": "MAZ",
					"carModel": "5449",
					"VIN": "VIN54463d412cb4e449",
					"avgSpeed": "30.00",
					"location": "27.633762;53.916788;0"
				}, {
					"carId": "2",
					"status.status": "A",
					"licPlate": "",
					"carName": "MAZ",
					"carModel": "5449",
					"VIN": "VIN54463d412cb4e449",
					"avgSpeed": "30.00",
					"location": "27.633805;53.905472;0"
				}, {
					"carId": "3",
					"status.status": "D",
					"licPlate": "",
					"carName": "MAZ",
					"carModel": "5449",
					"VIN": "VIN54463d412cb4e449",
					"avgSpeed": "30.00",
					"location": "27.634979;53.912372;0"
				}, {
					"carId": "1",
					"status.status": "N",
					"licPlate": "",
					"carName": "MAZ",
					"carModel": "5449",
					"VIN": "VIN54463d412cb4e449",
					"avgSpeed": "30.00",
					"location": "27.584679;53.916326;0"
				}]
			};
			var statuses = {
				N: "Warning",
				A: "Success",
				D: "Error"
			};
			data.results.forEach(function(spot, index) {
				spot.index = index + 1;
				spot.status = statuses[spot["status.status"]];
			});
			mapDataModel.setProperty("/spots", data.results);
			//	oModel.setProperty("/centerPosition","53.916326;27.584679");
			// oModel.setProperty("/zoomlevel",9);
			// 	},
			// 	error: function(data, textStatus, jqXHR) {
			// 		alert("error to post " + textStatus);
			// 	}
			// });
		},
	
		onLegendItemClick: function(evt) {
			var oMap = this.getMapControl();
			var car = evt.getSource().getBindingContext("mapData").getProperty();
			oMap.setCenterPosition(car.location.replace(";0", ""));
			oMap.setZoomlevel(15);
		},

		onFiltersChanged: function(evt) {
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

		getMapLegend: function() {
			return this.getView().byId("technicsLegend");
		},

		onSpotClickItem : function(evt){
			var that = this;
			var pos = {};
			var position = evt.getParameters().data.Action.Params.Param.forEach(function(param){
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
			that._oPopover.bindElement({path: evt.getSource().getBindingContext("mapData").getPath(), model: "mapData"});
			that._oPopover.setPlacement("PreferredRightOrFlip");
		
			setTimeout(function(){
				that._oPopover.openBy(that._spotDetailPointer);
			},1);
		},

		handleEmailPress: function (oEvent) {
			this._oPopover.close();
			MessageToast.show("E-Mail has been sent");
		}
	});
});