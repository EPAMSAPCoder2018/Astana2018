sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/m/Text',
	"com/epam/uirequests/model/models"
], function (Controller, Text, Models) {
	"use strict";

	return Controller.extend("com.epam.uirequests.controller.main", {
		onInit: function () {
			var oMap = this.getMapControl();
			var oMapConfig = {
				"MapProvider": [{
					"name": "GMAP",
					"Source": [{
						"id": "s1",
						"url": "https://mt.google.com/vt/lyrs=m&x={X}&y={Y}&z={LOD}"
					}]
				}],
				"MapLayerStacks": [{
					"name": "DEFAULT",
					"MapLayer": {
						"name": "layer1",
						"refMapProvider": "GMAP",
						"opacity": "1",
						"colBkgnd": "RGB(255,255,255)"
					}
				}]
			};
			oMap.setMapConfiguration(oMapConfig);
			oMap.setRefMapLayerStack("DEFAULT");
			if (this.MODELS) {
				var modelsNames = Object.keys(this.MODELS);
				for (var i = 0; i < modelsNames.length; i++) {
					this.getView().setModel(this.MODELS[modelsNames[i]], modelsNames[i]);
				}
			}
			var mapDataModel = Models.createMapDataModel();
			mapDataModel.setData({
				spots: []
			});
			this.getView().setModel(Models.createRequestFiltersModel.apply(this), "requestsFiltersModel");
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

		onAfterRendering: function () {
			var oMap = this.getMapControl();
			if (!this._spotDetailPointer) {
				var that = this;
				setTimeout(function () {
					var textView = new Text(that.createId("SpotDetailPointer"));
					var contentId = oMap.getId() + "-geoscene-winlayer";
					var cont = document.getElementById(contentId);
					var rm = sap.ui.getCore().createRenderManager();
					rm.renderControl(textView);
					rm.flush(cont);
					rm.destroy();
					that._spotDetailPointer = textView;
				}, 1000);
			}

			this._mapDataLoadingTask.start();
		},

		onZoomChanged: function (evt) {
			if (this._oPopover) {
				this._oPopover.close();
			}
		},

		onExit: function () {
			if (this._oPopover) {
				this._oPopover.destroy();
			}
		},

		getMapControl: function () {
			return this.getView().byId("vbi");
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
				that._oPopover = sap.ui.xmlfragment("com.epam.uirequests.view.fragment.requestDetails", that);
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

		getMapLegend: function () {
			return this.getMapControl().getLegend();
		},

		onLegendItemClick: function (evt) {
			var oMap = this.getMapControl();
			var crmRequest = evt.getSource().getBindingContext("mapData").getProperty();
			oMap.setCenterPosition(crmRequest.location.replace("; 0", ""));
			oMap.setZoomlevel(15);
		},

		createPeriodicalyTask: function (taskToExecute, delay) {
			var timer;
			var start = function () {
				function run() {
					taskToExecute();
					timer = setTimeout(run, delay);
				};
				timer = setTimeout(run, 1);
			};
			return {
				start: start,
				stop: function () {
					if (timer) {
						clearTimeout(timer);
						timer = null;
					}
				}
			};
		}
	});
});