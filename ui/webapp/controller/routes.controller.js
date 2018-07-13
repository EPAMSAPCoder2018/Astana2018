sap.ui.define([
	"com/epam/ui/controller/base.controller",
	'sap/m/Text',
	"com/epam/ui/model/models"
], function (BaseController, Text, Models) {
	"use strict";
	return BaseController.extend("com.epam.ui.controller.routes", {
		onInit: function () {
			BaseController.prototype.onInit.apply(this, arguments);
			var mapDataModel = Models.createMapDataModel();
			this.getView().setModel(Models.createRoutesFiltersModel(), "routesFiltersModel");
			this.getView().setModel(mapDataModel, "mapData");
			this._mapDataModel = mapDataModel;
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
						var statuses = {
							I: "rgb(240,255,0)",
							D: "rgb(0,255,0)",
							P: "rgb(152,152,152)"
						}; //p - planned

						data.results.forEach(function (order, i) {
							order.color = statuses[order.status];
							order.stages.forEach(function (stage, index) {
								stage.index = index + 1;
								stage.id = stage.stageId;
								stage.color = statuses[stage.status];
								stage.geoFrom = stage.geoFrom.split(",").reverse().join(";");
								stage.geoTo = stage.geoTo.split(",").reverse().join(";");
								stage.createDate = stage.geoFromName + " - " + stage.geoToName;
							});
						});
						data.results = data.results.map(function (order, i) {
							var newOrder = {};
							newOrder.index = i + 1;
							newOrder.car = order.car;
							newOrder.id = order.orderId;
							newOrder.status = order.status;
							newOrder.createDate = order.orderDate;
							newOrder.color = statuses[order.status];
							newOrder.geoToName = "To";
							newOrder.geoFromName = "From";
							newOrder.stages = [{
								vector: {}
							}];
							newOrder.orinalOrder = [order];
							newOrder.stages[0].vector.coordinates = order.stages.map(function (stage, index) {
								return stage.vector.coordinates;
							}).join(";");
							newOrder.stages[0].color = statuses[order.status];
							newOrder.stages[0].centerPosition = order.stages[Math.round(order.stages.length / 2)].geoFrom.split(",").reverse().join(
								";");
							return newOrder;
						});
						// data.results.forEach(function (order, index) {
						// 	order.index = index + 1;
						// 	order.status = statuses[order["status"]];
						// });
						data.backButtonVisible = false;
						mapDataModel.setData(data);
					},
					error: function (data, textStatus, jqXHR) {
						alert("error to post " + textStatus);
					}
				});
			}, 5000);
		},

		onAfterRendering: function () {
			BaseController.prototype.onAfterRendering.apply(this, arguments);
			this._mapDataLoadingTask.start();
		},

		onHideView: function (evt) {
			if (this._devicesLoadingTask) {
				this._devicesLoadingTask.stop();
			} else {
				this._mapDataLoadingTask.stop();
			}
		},

		onBackButtonPress: function (evt) {
			if (this._pathForParent) {
				this._devicesLoadingTask.stop();
				this._mapDataModel.setProperty("/backButtonVisible", false);
				this.changeVosBinding("mapData>" + this._pathForParent, null, 8, true);
				delete this._pathForParent;
				delete this._devicesLoadingTask;
				this._mapDataLoadingTask.start();
			}
		},

		changeVosBinding: function (newPath, zoomPoint, zoomLevel, isNavBack) {
			var oMap = this.getMapControl();
			var bindingInfoVos = oMap.getBindingInfo("vos");
			var bindingInfoLegend = oMap.getLegend().getBindingInfo("items");
			oMap.setCenterPosition(zoomPoint || oMap.getCenterPosition());
			zoomLevel = zoomLevel || 12;
			if (oMap.getZoomlevel() < zoomLevel) {
				oMap.setZoomlevel(zoomLevel);
			}
			oMap.bindAggregation("vos", {
				path: newPath,
				template: bindingInfoVos.template
			});
			oMap.getLegend().bindAggregation("items", {
				path: newPath + (isNavBack ? "" : "/0/stages"),
				template: bindingInfoLegend.template
			});
			this._pathForParent = bindingInfoVos.path;
		},

		onClickRoute: function (evt) {
			if (!this._pathForParent) {
				var that = this;
				var context = evt.getSource().getBindingContext("mapData");
				var centerPosition = evt.getParameters().data.Action.AddActionProperties.AddActionProperty[0]["#"].replace(";0.0", ""); //context.getProperty().centerPosition;
				var path = context.getPath().replace("/stages/0", "") + "/orinalOrder"; // /stages/0 - it is fixed part
				var order = this._mapDataModel.getProperty(context.getPath().replace("/stages/0", ""));
				var statuses = {
					GPS: "rgba(0,255,0,0.5)",
					SNOWPLOW: "rgba(0,128,255,0.5)",
					SALT_SPREADER: "rgba(255,0,255,0.5)",
					BRUSH: "rgba(255,128,0,0.5)"
				};
				this._mapDataLoadingTask.stop();
				if (order.id === 1000003) {
					this._devicesLoadingTask = this.createPeriodicalyTask(function () {
						$.ajax({
							type: "GET",
							url: "/services/getDevicesStatisticsByOrder.xsjs?orderId=" + order.id,
							async: false,
							success: function (data, textStatus, jqXHR) {
								data.forEach(function (stage, index) {
									stage.index = index + 1;
									stage.id = stage.orderId;
									stage.color = statuses[stage.status];
									stage.createDate = stage.status;
								});
								var items = [that._mapDataModel.getProperty(path + "/0")];
								items.push({
									stages: data
								});
								that._mapDataModel.setProperty(path, items);
							},
							error: function (data, textStatus, jqXHR) {
								alert("error to post " + textStatus);
							}
						});
					}, 5000);
					this._devicesLoadingTask.start();
				}
				this.changeVosBinding("mapData>" + path, centerPosition, 13);
				this._mapDataModel.setProperty("/backButtonVisible", true);
			}
		},

		onLegendItemClick: function (evt) {
			var oMap = this.getMapControl();
			var context = evt.getSource().getBindingContext("mapData");
			var data = context.getProperty();
			var pos = null;
			var colorPath = null;
			if (data.stages) {
				pos = data.stages[0].centerPosition;
				colorPath = context.getPath() + "/stages/0/color";
			} else {
				pos = data.geoFrom;
				colorPath = context.getPath() + "/color";
			}
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
			oMap.setCenterPosition(pos);
			if (oMap.getZoomlevel() < 13) {
				oMap.setZoomlevel(13);
			}
		},

		onFiltersChanged: function (evt) {
			var oMap = this.getMapControl();
			var oMapLegend = this.getMapLegend();
			var binding = !this._pathForParent ? oMap.getBinding("vos") : oMap.getAggregation("vos")[0].getBinding("items");
			var key = evt.getParameters().selectedItem.getKey();
			oMap.setZoomlevel(13);
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
			oMap.setZoomlevel(13);
			var filters = [];
			if (key === "All") {
				filters = [
					new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "BRUSH"),
					new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "SALT_SPREADER"),
					new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "SNOWPLOW"),
					new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, "GPS")
				];
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
			if (this._oPopover) {
				this._oPopover.close();
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

		onExit: function () {
			if (this._oPopover) {
				this._oPopover.destroy();
			}
		},

		handleEmailPress: function (oEvent) {
			this._oPopover.close();
			MessageToast.show("E-Mail has been sent");
		}
	});
});