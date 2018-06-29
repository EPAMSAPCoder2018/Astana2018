sap.ui.define([
	"com/epam/ui/controller/base.controller",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";
	return BaseController.extend("com.epam.ui.controller.technics", {
		onInit: function() {
			BaseController.prototype.onInit.apply(this, arguments);
			var oMap = this.getMapControl();
			var oModel = new JSONModel({
				spots: [],
				routes: [],
				areas: [],
				//	centerPosition : "0:0",
				initialZoom: 2
			});
			oMap.setModel(oModel, "mapData");
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
			oModel.setProperty("/spots", data.results);
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

		//var oPanel = null;
		onCloseDetail: function(evt) {
			//alert("onCloseDetail" + this);
		},
		
		onSpotClickItem : function(evt){
			evt.getSource().openDetailWindow("Car Details", "0", "0" );   
		},

		onOpenDetail: function(evt) {
			var cont = document.getElementById(evt.getParameter("contentarea").id);
			cont.innerHTML = "<ul>" +
			  "<li><b>Car Id : </b> 123</li>" + 
			  "<li><b>VIN : </b> VIN 123</li>" + 
			  "</ul>";
			cont.style.color = "Blue";
		}
	});
});