sap.ui.define([
	"com/epam/ui/controller/base.controller",
	'sap/m/Text',
	"com/epam/ui/model/models"
], function (BaseController, Text, Models) {
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

	var MODELS = {
		"routesFiltersModel": Models.createRoutesFiltersModel(),
		"mapData": Models.createMapDataModel(),
		"technicalModel": Models.createEmptyJSONModel(),
		"carsModel": Models.createEmptyJSONModel(),
		"stagesModel": Models.createEmptyJSONModel()
	};
	MODELS.technicalModel.setProperty("/isOrderOpened", false);
	MODELS.technicalModel.setProperty("/lineWidth", 6);
	MODELS.stagesModel.setData([{
		isStage: true,
		routes: []
	}, {
		isStage: true,
		routes: []
	}, {
		isSpot: true,
		spots: []
	}]);
	return BaseController.extend("com.epam.ui.controller.routes", {
		onInit: function () {
			this.MODELS = MODELS;
			BaseController.prototype.onInit.apply(this, arguments);
			this._filters = {
				status: [new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "I"), new sap.ui.model.Filter("status", sap.ui
					.model.FilterOperator.EQ, "D"), new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "P")],
				device: [new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "BRUSH"), new sap.ui.model.Filter("status", sap.ui
						.model.FilterOperator.EQ, "SALT_SPREADER"), new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "SNOWPLOW"), new sap
					.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "GPS")
				]
			};
			this._mapDataLoadingTask = this.createPeriodicalyTask(function () {
				$.ajax({
					type: "GET",
					url: "/services/getOrders.xsjs",
					async: false,
					success: function (data, textStatus, jqXHR) {
						data.results.forEach(function (order, i) {
							order.index = i + 1;
							order.color = STATUSES_MAPPING[order.status];
							order.isOrder = true;
						});
						MODELS.mapData.setData(data);
					},
					error: function (data, textStatus, jqXHR) {
						alert("error to post " + textStatus);
					}
				});
			}, 5000);
		},

		onAfterRendering: function () {
			BaseController.prototype.onAfterRendering.apply(this, arguments);
			if (this._devicesLoadingTask || this._stagesLoadingTask) {
				if (this._devicesLoadingTask) {
					this._devicesLoadingTask.start();
				}
				if (this._stagesLoadingTask) {
					this._stagesLoadingTask.start();
				}
			} else {
				this._mapDataLoadingTask.start();
			}
		},

		onHideView: function (evt) {
			if (this._devicesLoadingTask || this._stagesLoadingTask) {
				if (this._devicesLoadingTask) {
					this._devicesLoadingTask.start();
				}
				if (this._stagesLoadingTask) {
					this._stagesLoadingTask.start();
				}
			} else {
				this._mapDataLoadingTask.stop();
			}
		},

		onBackButtonPress: function (evt) {
			if (this._pathForParent) {
				if (this._devicesLoadingTask || this._stagesLoadingTask) {
					if (this._devicesLoadingTask) {
						this._devicesLoadingTask.start();
					}
					if (this._stagesLoadingTask) {
						this._stagesLoadingTask.start();
					}
				}
				MODELS.technicalModel.setProperty("/isOrderOpened", false);
				this.changeVosBinding("mapData>" + this._pathForParent, null, 8, true);
				delete this._pathForParent;
				delete this._devicesLoadingTask;
				delete this._stagesLoadingTask;
				this._mapDataLoadingTask.start();
			}
		},

		changeVosBinding: function (newPath, zoomPoint, zoomLevel, isNavBack, pathForDetails) {
			var oMap = this.getMapControl();
			var orderDatails = this.getView().byId("orderDatails");
			var bindingInfoVos = oMap.getBindingInfo("vos");
			var bindingInfoLegend = oMap.getLegend().getBindingInfo("items");
			oMap.setCenterPosition(zoomPoint || oMap.getCenterPosition());
			zoomLevel = zoomLevel || 12;
			if (oMap.getZoomlevel() < zoomLevel) {
				oMap.setZoomlevel(zoomLevel);
			}
			oMap.bindAggregation("vos", {
				path: newPath,
				factory: bindingInfoVos.factory
			});
			if (pathForDetails) {
				orderDatails.bindElement({
					path: pathForDetails,
					model: "mapData"
				});
			}
			oMap.getLegend().bindAggregation("items", {
				path: newPath + (isNavBack ? "" : "0/routes"),
				factory: bindingInfoLegend.factory
			});
			this._pathForParent = bindingInfoVos.path;
		},

		onClickRoute: function (evt) {
			if (!this._pathForParent) {
				var that = this;
				var context = evt.getSource().getBindingContext("mapData");
				var centerPosition = evt.getParameters().data.Action.AddActionProperties.AddActionProperty[0]["#"].replace(";0.0", ""); //context.getProperty().centerPosition;
				var order = context.getProperty();
				this._mapDataLoadingTask.stop();
				this._stagesLoadingTask = this.createPeriodicalyTask(function () {
					$.ajax({
						type: "GET",
						url: "/services/getAllStages.xsjs?orderId=" + order.id,
						async: false,
						success: function (data, textStatus, jqXHR) {
							data.forEach(function (stage, index) {
								stage.index = index + 1;
								stage.id = stage.stageId;
								stage.color = STATUSES_MAPPING[stage.status];
								stage.createDate = stage.status;
							});
							MODELS.stagesModel.setProperty("/0/routes", data);
						},
						error: function (data, textStatus, jqXHR) {
							alert("error to post " + textStatus);
						}
					});
				}, 5000);
				this._stagesLoadingTask.start();
				if (order.id === 1000003) {
					this._devicesLoadingTask = this.createPeriodicalyTask(function () {
						$.ajax({
							type: "GET",
							url: "/services/getDevicesStatisticsByOrder.xsjs?orderId=" + order.id,
							async: false,
							success: function (data, textStatus, jqXHR) {
								data.forEach(function (stage, index) {
									stage.index = index + 1;
									stage.id = stage.stageId;
									stage.color = STATUSES_MAPPING[stage.status];
									stage.createDate = stage.status;
								});
								MODELS.stagesModel.setProperty("/1/routes", data);
								MODELS.stagesModel.setProperty("/2/spots", [{
									coordinates: "27.659810066223145;53.92362976074219;0"
								}]);
							},
							error: function (data, textStatus, jqXHR) {
								alert("error to post " + textStatus);
							}
						});
					}, 5000);
					this._devicesLoadingTask.start();
				}
				this.changeVosBinding("stagesModel>/", centerPosition, 13, false, context.getPath());
				MODELS.technicalModel.setProperty("/isOrderOpened", true);
			}
		},

		onLegendItemClick: function (evt) {
			var oMap = this.getMapControl();
			var context = evt.getSource().getBindingContext("mapData") || evt.getSource().getBindingContext("stagesModel");
			var data = context.getProperty();
			var pos = null;
			var colorPath = context.getPath() + "/color";
			var color = data.color;
			var colorHighlighter = function (counter, enableHighlighting) {
				if (counter < 6) {
					setTimeout(function () {
						if (enableHighlighting) {
							context.getModel().setProperty(colorPath, "RGB(51;255;255)");
						} else {
							context.getModel().setProperty(colorPath, color);
						}
						counter++;
						colorHighlighter(counter, !enableHighlighting);
					}, 600);
				}
			}
			colorHighlighter(0, true);
			//	oMap.setCenterPosition(pos);
			if (oMap.getZoomlevel() < 13) {
				oMap.setZoomlevel(13);
			}
		},

		onFiltersChanged: function (evt) {
			var oMap = this.getMapControl();
			var oMapLegend = this.getMapLegend();
			var binding = !this._pathForParent ? oMap.getBinding("vos") : oMap.getAggregation("vos")[0].getBinding("items");
			var key = evt.getParameters().selectedItem.getKey();
			var filters = [];
			if (key === "All") {
				filters = [
					new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "I"),
					new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "D"),
					new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "P")
				];
			} else {
				filters = [
					new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, key)
				];
			}
			this._filters.status = filters;
			binding.filter([new sap.ui.model.Filter({
				filters: filters.concat(this._filters.device),
				and: false
			})]);
			oMapLegend.getBinding("items").filter([new sap.ui.model.Filter({
				filters: filters,
				and: false
			})]);
		},

		onDevicesFiltersChanged: function (evt) {
			var oMap = this.getMapControl();
			var oMapLegend = this.getMapLegend();
			var binding = oMap.getAggregation("vos")[1].getBinding("items");
			var key = evt.getParameters().selectedItem.getKey();
			var filters = [];
			if (key === "All") {
				filters = [
					new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "BRUSH"),
					new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "SALT_SPREADER"),
					new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "SNOWPLOW"),
					new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "GPS")
				];
			} else if (key === "NA") {
				filters = [];
			} else {
				filters = [
					new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, key)
				];
			}
			this._filters.device = filters;
			binding.filter([new sap.ui.model.Filter({
				filters: filters,
				and: false
			})]);
		},

		onZoomChanged: function (evt) {
			BaseController.prototype.onZoomChanged.apply(this, arguments);
			var zoomLevel = parseInt(evt.getParameter("zoomLevel"));
			zoomLevel = zoomLevel > 15 ? zoomLevel : zoomLevel - 6
			MODELS.technicalModel.setProperty("/lineWidth", zoomLevel);
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

		onExit: function () {
			if (this._oPopover) {
				this._oPopover.destroy();
			}
		},

		handleEmailPress: function (oEvent) {
			this._oPopover.close();
			MessageToast.show("E-Mail has been sent");
		},

		vosFactoryFunction: function (sId, oContext) {
			var currentObject = oContext.getProperty();
			var routes = null;
			if (currentObject.isOrder) {
				routes = new sap.ui.vbm.Routes({
					items: [new sap.ui.vbm.Route({
						colorBorder: "rgb(255,255,255)",
						linewidth: "{= ${mapData>lineWidth} !== undefined ? ${mapData>lineWidth} : ${technicalModel>/lineWidth}}",
						position: "{mapData>coordinates}",
						tooltip: "{mapData>description}",
						end: "0",
						start: "0",
						color: "{mapData>color}",
						click: [this.onClickRoute, this]
					})]
				});
			} else if (currentObject.isStage) {
				routes = new sap.ui.vbm.Routes({
					items: {
						path: "stagesModel>routes",
						template: new sap.ui.vbm.Route({
							colorBorder: "rgb(255,255,255)",
							linewidth: "{= ${stagesModel>lineWidth} !== undefined ? ${stagesModel>lineWidth} : ${technicalModel>/lineWidth}}",
							position: "{stagesModel>coordinates}",
							tooltip: "{stagesModel>description}",
							end: "0",
							start: "0",
							color: "{stagesModel>color}",
							click: [this.onClickRoute, this]
						})
					}
				});
			} else if (currentObject.isSpot) {
				routes = new sap.ui.vbm.Spots({
					items: {
						path: "stagesModel>spots",
						template: new sap.ui.vbm.Spot({
							position: "{stagesModel>coordinates}",
							state: "Error",
							color: "{stagesModel>color}"
						})
					}
				});
			}
			return routes;
		},

		legendFactoryFunction: function (sId, oContext) {
			var currentObject = oContext.getProperty();
			var item = null;
			var that = this;
			if (currentObject.isOrder) {
				item = new sap.ui.vbm.LegendItem(sId, {
					text: "{= 'Order ' + ${mapData>index} + ': ' + ${mapData>createDate} }",
					color: "{mapData>color}",
					click: [this.onLegendItemClick, this]
				});
			} else {
				item = new sap.ui.vbm.LegendItem(sId, {
					text: "{= 'Stage ' + ${stagesModel>index} + ': ' + ${stagesModel>geoFromName} + '-' + ${stagesModel>geoToName} }",
					color: "{stagesModel>color}",
					click: [this.onLegendItemClick, this]
				});
			}
			return item;
		},

		onChartClick: function (evt) {
			MODELS.routesFiltersModel.setProperty("/selectedDeviceKey", evt.getSource().data("name"))
			this.onDevicesFiltersChanged({
				getParameters: function () {
					return {
						selectedItem: {
							getKey: function () {
								return evt.getSource().data("name");
							}
						}
					};
				}
			});
		}
	});
});