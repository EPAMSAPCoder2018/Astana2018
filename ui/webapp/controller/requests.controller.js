sap.ui.define([
	"com/epam/ui/controller/base.controller",
	"sap/ui/model/json/JSONModel",
	"com/epam/ui/model/models"
], function (BaseController, JSONModel, Models) {
	"use strict";
	return BaseController.extend("com.epam.ui.controller.technics", {
		onInit: function () {
			BaseController.prototype.onInit.apply(this, arguments);
			this.getView().setModel(Models.createRequestFiltersModel(), "requestsFiltersModel");

			var mapDataModel = Models.createMapDataModel();
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
			// 	url: "/services/getCustomersRequests.xsjs",
			// 	//url: "/services/getCarsCurrentPositions.xsjs",
			// 	async: false,
			// 	success: function(data, textStatus, jqXHR) {
			var data = {
				"result": [{
					"requestDate": "2017-10-06T21:10:00.000Z",
					"requestStatus": "Done",
					"problem": "Ice",
					"description": "Lorem ipsum",
					"custName": "Mallorie",
					"custSurName": "Verni",
					"phone": "782-328-0452",
					"address": "122 Nancy Terrace",
					"location": "27.551886; 53.924332; 0"
				}, {
					"requestDate": "2018-06-02T18:55:12.000Z",
					"requestStatus": "Done",
					"problem": "Ice",
					"description": "Lorem ipsum",
					"custName": "Hazlett",
					"custSurName": "Kippling",
					"phone": "380-134-6513",
					"address": "45 Garrison Park",
					"location": "27.451886; 53.9; 0"
				}, {
					"requestDate": "2018-01-09T02:21:16.000Z",
					"requestStatus": "Open",
					"problem": "Dirty street",
					"description": "Lorem ipsum",
					"custName": "Moshe",
					"custSurName": "Coope",
					"phone": "664-787-5664",
					"address": "78135 Pepper Wood Road",
					"location": "27.458845; 53.885903; 0"
				}, {
					"requestDate": "2017-08-09T18:18:51.000Z",
					"requestStatus": "Done",
					"problem": "Hole on the road",
					"description": "Lorem ipsum",
					"custName": "Vi",
					"custSurName": "Ganter",
					"phone": "280-133-2113",
					"address": "1314 Gale Way",
					"location": "27.463995; 53.937673; 0"
				}, {
					"requestDate": "2017-11-26T22:28:00.000Z",
					"requestStatus": "In process",
					"problem": "Ice",
					"description": "Lorem ipsum",
					"custName": "Celestyn",
					"custSurName": "Croci",
					"phone": "163-715-2552",
					"address": "83 Oneill Alley",
					"location": "27.593428; 53.938885; 0"
				}]
			};
			var statuses = {
				"Done": "Success",
				"In process": "Warning",
				"Open": "Error"
			};
			data.result.forEach(function (spot, index) {
				spot.index = index + 1;
				spot.status = statuses[spot["requestStatus"]];
			});
			oModel.setProperty("/spots", data.result);
			//	oModel.setProperty("/centerPosition","53.916326;27.584679");
			// oModel.setProperty("/zoomlevel",9);
			// 	},
			// 	error: function(data, textStatus, jqXHR) {
			// 		alert("error to post " + textStatus);
			// 	}
			// });
		},

		onLegendItemClick: function (evt) {
			var oMap = this.getMapControl();
			var crmRequest = evt.getSource().getBindingContext("mapData").getProperty();
			oMap.setCenterPosition(crmRequest.location.replace("; 0", ""));
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

		getMapLegend: function () {
			return this.getView().byId("requestsLegend");
		},

		//var oPanel = null;
		onCloseDetail: function (evt) {
			//alert("onCloseDetail" + this);
		},
		
		onAfterRendering : function(){
			var oMap = this.getMapControl();
			if (!this._spotDetailPointer) {
				var textView = new Text(this.createId("SpotDetailPointer"));
				var contentId = oMap.getId() + "-geoscene-winlayer";
				var cont = document.getElementById(contentId);
				var rm = sap.ui.getCore().createRenderManager();
				rm.renderControl(textView);
				rm.flush(cont);
				rm.destroy();
				this._spotDetailPointer = textView;
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
		},

	});
});