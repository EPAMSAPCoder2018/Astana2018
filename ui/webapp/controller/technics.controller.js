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
		
		onAfterRendering : function(){
			var oMap = this.getMapControl();
			var textView = new Text(this.createId("SpotDetailPointer"));
			var contentId = oMap.getId() + "-geoscene-winlayer";
			var cont = document.getElementById(contentId);
			var rm = sap.ui.getCore().createRenderManager();
			rm.renderControl(textView);
			rm.flush(cont);
			rm.destroy();	
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
		
		onZoomChanged : function(evt){
			if (this._oPopover) {
				this._oPopover.close();
			}
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
				that._oPopover.openBy(that.getView().byId("SpotDetailPointer"));
			},1);
		},

		onOpenDetail: function(evt) {
			var fragment = sap.ui.fragment("com.epam.ui.view.fragment.carDetails", "XML", this);

			var cont = document.getElementById(evt.getParameter("contentarea").id);
			var rm = sap.ui.getCore().createRenderManager();
			rm.renderControl(fragment);//new sap.m.Button({text:"press"}));
			rm.flush(cont);
			rm.destroy();
		//cont.innerHTML = '<div id="__popover1" data-sap-ui="__popover1" class="sapMPopover sapMPopoverWithBar sapMPopoverWithFooter sapMPopoverWithoutSubHeader sapMPopup-CTX sapUiContentPadding sapUiShd" tabindex="-1" role="dialog" aria-labelledby="__popover1-intHeader" data-sap-ui-popup="id-1530695436475-11" style="position: absolute; visibility: visible; z-index: 10; display: block; overflow: visible; top: 2px; left: 904px; bottom: 310px;"><span class="sapMPopoverHiddenFocusable" id="__popover1-firstfe" tabindex="0"></span><header class="sapMPopoverHeader"><div id="__popover1-intHeader" data-sap-ui="__popover1-intHeader" data-sap-ui-fastnavgroup="true" role="toolbar" class="sapMBar sapMBar-CTX sapMContent-CTX sapMHeader-CTX sapMIBar sapMIBar-CTX"><div id="__popover1-intHeader-BarLeft" class="sapMBarContainer sapMBarLeft"></div><div id="__popover1-intHeader-BarMiddle" class="sapMBarMiddle"><div id="__popover1-intHeader-BarPH" style="width:100%" class="sapMBarContainer sapMBarPH"><h1 id="__popover1-title" data-sap-ui="__popover1-title" class="sapMBarChild sapMTitle sapMTitleMaxWidth sapMTitleNoWrap sapMTitleStyleAuto sapUiSelectable"><span id="__popover1-title-inner">car</span></h1></div></div><div id="__popover1-intHeader-BarRight" class="sapMBarContainer sapMBarRight"></div></div></header><div id="__popover1-cont" class="sapMPopoverCont" role="application" style="overflow: auto; max-width: 1900px; height: 0px;"><div class="sapMPopoverScroll" id="__popover1-scroll" style="display: block;"></div></div><footer class="sapMPopoverFooter "><div id="__toolbar0" data-sap-ui="__toolbar0" data-sap-ui-fastnavgroup="true" role="toolbar" class="sapContrast sapContrastPlus sapMFooter-CTX sapMIBar sapMIBar-CTX sapMTB sapMTB-Auto-CTX sapMTBInactive sapMTBNewFlex sapMTBNoBorders sapMTBStandard"><div id="__spacer0" data-sap-ui="__spacer0" class="sapMBarChild sapMTBSpacer sapMTBSpacerFlex"></div><button id="email" data-sap-ui="email" class="sapMBarChild sapMBtn sapMBtnBase"><span id="email-inner" class="sapMBtnDefault sapMBtnHoverable sapMBtnInner sapMBtnText sapMFocusable"><span class="sapMBtnContent" id="email-content"><bdi>Email</bdi></span></span></button></div></footer><span id="__popover1-arrow" class="sapMPopoverArr sapMPopoverArrDown sapContrast sapContrastPlus" style="left: 42px;"></span><span class="sapMPopoverHiddenFocusable" id="__popover1-lastfe" tabindex="0"></span></div>';
			cont.style.color = "Blue";
		},
		
		onExit : function () {
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