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

			// $.ajax({
			// 	type: "GET",
			// 	url: "/services/getOrders.xsjs",
			// 	async: false,
			// 	success: function(data, textStatus, jqXHR) {
			var data = {
				"results": [{
					"stages": [{
						"stageId": 2000000,
						"geoFrom": "53.916021,27.631271",
						"geoTo": "53.92004,27.637043",
						"status": "P",
						"geoFromName": "Office",
						"geoToName": "Parnikovaya",
						"vector": {
							"vectorId": 3000005,
							"coordinates": "27.63127;53.916;0;27.63145;53.91587;0;27.63204;53.91614;0;27.63314;53.91663;0;27.63348;53.91675;0;27.63379;53.91681;0;27.63412;53.91684;0;27.63448;53.91684;0;27.63504;53.91683;0;27.63619;53.91675;0;27.63637;53.91674;0;27.63645;53.91757;0;27.6365;53.91797;0;27.63662;53.91859;0;27.63674;53.91899;0;27.63712;53.92003;0"
						}
					}, {
						"stageId": 2000001,
						"geoFrom": "53.92004,27.637043",
						"geoTo": "53.92939,27.639564",
						"status": "P",
						"geoFromName": "Parnikovaya",
						"geoToName": "Skoriny",
						"vector": {
							"vectorId": 3000006,
							"coordinates": "27.63712;53.92003;0;27.63769;53.92148;0;27.63877;53.92431;0;27.63933;53.92581;0;27.63948;53.92633;0;27.63963;53.92703;0;27.6397;53.92758;0;27.63973;53.92826;0;27.63968;53.92884;0;27.63958;53.92939;0"
						}
					}, {
						"stageId": 2000002,
						"geoFrom": "53.92939,27.639564",
						"geoTo": "53.926851,27.654981",
						"status": "P",
						"geoFromName": "Skoriny",
						"geoToName": "Square",
						"vector": {
							"vectorId": 3000007,
							"coordinates": "27.63958;53.92939;0;27.63957;53.92942;0;27.63924;53.92937;0;27.63934;53.92891;0;27.63938;53.92851;0;27.63953;53.92838;0;27.63964;53.9283;0;27.63973;53.92826;0;27.63991;53.92827;0;27.64039;53.92835;0;27.64089;53.92846;0;27.64118;53.92856;0;27.64133;53.92867;0;27.64148;53.92876;0;27.64171;53.92884;0;27.64197;53.92887;0;27.64221;53.92884;0;27.64249;53.92877;0;27.64539;53.92814;0;27.64757;53.92771;0;27.6487;53.92753;0;27.64923;53.92746;0;27.65019;53.92737;0;27.65485;53.92696;0;27.65496;53.92684;0"
						}
					}, {
						"stageId": 2000003,
						"geoFrom": "53.926851,27.654981",
						"geoTo": "53.917892,27.654531",
						"status": "P",
						"geoFromName": "Square",
						"geoToName": "Expedition",
						"vector": {
							"vectorId": 3000008,
							"coordinates": "27.65497;53.92683;0;27.65468;53.92568;0;27.65443;53.92498;0;27.65399;53.92398;0;27.65374;53.92317;0;27.65364;53.92289;0;27.65361;53.92273;0;27.6539;53.92009;0;27.65395;53.91954;0;27.65411;53.91907;0;27.65467;53.91823;0;27.6548;53.91805;0;27.65477;53.918;0;27.65468;53.91793;0;27.65454;53.91788;0"
						}
					}, {
						"stageId": 2000004,
						"geoFrom": "53.917892,27.654531",
						"geoTo": "53.916021,27.631271",
						"status": "P",
						"geoFromName": "Expedition",
						"geoToName": "Office",
						"vector": {
							"vectorId": 3000009,
							"coordinates": "27.65454;53.91788;0;27.65445;53.91785;0;27.65438;53.91783;0;27.65173;53.91819;0;27.6499;53.91839;0;27.64744;53.91871;0;27.64449;53.91908;0;27.64221;53.9194;0;27.64033;53.9197;0;27.63763;53.92003;0;27.637;53.92011;0;27.63678;53.91957;0;27.63639;53.91851;0;27.63632;53.91805;0;27.63619;53.91675;0;27.63574;53.91678;0;27.63468;53.91684;0;27.63395;53.91683;0;27.63357;53.91677;0;27.63322;53.91666;0;27.63145;53.91587;0;27.63127;53.916;0"
						}
					}],
					"car": {
						"carId": "54463d412cb4e449",
						"status": "A",
						"licPlate": "LIC 876",
						"carName": "MAZ",
						"carModel": "5449",
						"VIN": "VIN54463d412cb4e449",
						"avgSpeed": "30.00"
					},
					"orderId": 1000001,
					"status": "P",
					"orderDate": "2018-06-19T12:00:00.000Z"
				}, {
					"stages": [{
						"stageId": 2000005,
						"geoFrom": "53.917634,27.655373",
						"geoTo": "53.91625,27.668898",
						"status": "P",
						"geoFromName": "Parnikovaya",
						"geoToName": "Geologicheskaya 59",
						"vector": {
							"vectorId": 3000010,
							"coordinates": "27.6554;53.91769;0;27.66515;53.91669;0;27.66573;53.91664;0;27.66597;53.91663;0;27.66623;53.91667;0;27.66657;53.91678;0;27.66692;53.91695;0;27.66734;53.9172;0;27.66778;53.91754;0;27.66849;53.91796;0;27.67;53.91898;0;27.67151;53.91995;0;27.67195;53.92018;0;27.67223;53.92024;0;27.67237;53.92024;0;27.67249;53.92022;0;27.67259;53.92019;0;27.67274;53.9201;0;27.67293;53.91994;0;27.67321;53.9196;0;27.67346;53.91924;0;27.67351;53.91914;0;27.67351;53.91903;0;27.67346;53.91898;0;27.67337;53.91892;0;27.67251;53.91866;0;27.67162;53.91843;0;27.67109;53.91825;0;27.67031;53.9179;0;27.66956;53.9175;0;27.66946;53.91742;0;27.66931;53.9172;0;27.66874;53.91624;0;27.66889;53.91623;0"
						}
					}, {
						"stageId": 2000006,
						"geoFrom": "53.91625,27.668898",
						"geoTo": "53.914185,27.677063",
						"status": "P",
						"geoFromName": "Geologicheskaya 59",
						"geoToName": "Svyazistov 11",
						"vector": {
							"vectorId": 3000011,
							"coordinates": "27.66889;53.91623;0;27.66874;53.91624;0;27.66841;53.9157;0;27.66782;53.91475;0;27.66776;53.91469;0;27.66826;53.91423;0;27.66961;53.91299;0;27.67055;53.91213;0;27.67099;53.91175;0;27.67335;53.91272;0;27.67431;53.91312;0;27.67433;53.91313;0;27.67444;53.91313;0;27.67581;53.91367;0;27.67707;53.91418;0"
						}
					}, {
						"stageId": 2000007,
						"geoFrom": "53.914185,27.677063",
						"geoTo": "53.918774,27.673125",
						"status": "P",
						"geoFromName": "Svyazistov 11",
						"geoToName": "Vysokaya",
						"vector": {
							"vectorId": 3000012,
							"coordinates": "27.67707;53.91418;0;27.67711;53.91419;0;27.6771;53.91421;0;27.67604;53.91527;0;27.6756;53.91572;0;27.67479;53.91661;0;27.67357;53.91789;0;27.67356;53.91804;0;27.67351;53.91831;0;27.67341;53.91848;0;27.67312;53.91877;0"
						}
					}],
					"car": {
						"carId": "54463d412cb4e449",
						"status": "A",
						"licPlate": "LIC 876",
						"carName": "MAZ",
						"carModel": "5449",
						"VIN": "VIN54463d412cb4e449",
						"avgSpeed": "30.00"
					},
					"orderId": 1000002,
					"status": "D",
					"orderDate": "2018-08-19T13:21:03.123Z"
				}]
			};
			var statuses = {
				I: "RGB(240;255;0)",
				D: "RGB(0;255;0)",
				P: "RGB(152;152;152)"
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
				newOrder.stages[0].centerPosition = order.stages[Math.round(order.stages.length / 2)].geoFrom.split(",").reverse().join(";");
				return newOrder;
			});
			// data.results.forEach(function (order, index) {
			// 	order.index = index + 1;
			// 	order.status = statuses[order["status"]];
			// });
			data.backButtonVisible = false;
			mapDataModel.setData(data);
			//	oModel.setProperty("/centerPosition","53.916326;27.584679");
			// oModel.setProperty("/zoomlevel",9);
			// 	},
			// 	error: function(data, textStatus, jqXHR) {
			// 		alert("error to post " + textStatus);
			// 	}
			// });
		},

		onAfterRendering: function () {
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

		onBackButtonPress: function (evt) {
			if (this._pathForParent) {
				this._mapDataModel.setProperty("/backButtonVisible", false);
				this.changeVosBinding("mapData>" + this._pathForParent, null, 8);
				delete this._pathForParent;
			}
		},

		changeVosBinding: function (newPath, zoomPoint, zoomLevel) {
			var oMap = this.getMapControl();
			var bindingInfoVos = oMap.getBindingInfo("vos");
			var bindingInfoLegend = oMap.getLegend().getBindingInfo("items");
			oMap.setCenterPosition(zoomPoint || "27.554899;53.904651");
			zoomLevel = zoomLevel || 12;
			if (oMap.getZoomlevel() < zoomLevel) {
				oMap.setZoomlevel(zoomLevel);
			}
			oMap.bindAggregation("vos", {
				path: newPath,
				template: bindingInfoVos.template
			});
			oMap.getLegend().bindAggregation("items", {
				path: newPath + "/0/stages",
				template: bindingInfoLegend.template
			});
			this._pathForParent = bindingInfoVos.path;
		},

		onClickRoute: function (evt) {
			var context = evt.getSource().getBindingContext("mapData");
			var centerPosition = context.getProperty().centerPosition;
			var path = context.getPath().replace("/stages/0", "") + "/orinalOrder"; // /stages/0 - it is fixed part
			this.changeVosBinding("mapData>" + path, centerPosition, 13);
			this._mapDataModel.setProperty("/backButtonVisible", true);
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
						if(enableHighlighting){
							context.getModel().setProperty(colorPath, "RGB(51;255;255)");
						}else{
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
			var binding = oMap.getBinding("vos");
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