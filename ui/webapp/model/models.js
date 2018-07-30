sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(JSONModel, Device) {
	"use strict";

	return {
		
		createEmptyJSONModel: function() {
			var oModel = new JSONModel(Device);
			return oModel;
		},

		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		
		createTabHandlerModel: function() {
			var oModel = new JSONModel({
				selectedTabKey : "routes" // possible values technics and routes and requests
			});
			return oModel;
		},
		
		createRoutesFiltersModel: function() {
			var oModel = new JSONModel({
				selectedKey : "All",
				items : [{
					name : "All",
					key : "All"
				},{
					name : "В работе",
					key : "I"
				},{
					name : "Завершен",
					key : "D"
				},{
					name : "Планируется",
					key : "P"
				}],
				selectedDeviceKey : "All",
				devices : [{
					name : "Все",
					key : "All"
				},{
					name : "Снегоочиститель",
					key : "SNOWPLOW"
				},{
					name : "Солеразбрасыватель",
					key : "SALT_SPREADER"
				},{
					name : "Щетки",
					key : "BRUSH"
				},{
					name : "Не определено",
					key : "NA"
				}]
			});
			return oModel;
		},
		
		createTechnicFiltersModel: function() {
			var i18n = this.getOwnerComponent().getModel("i18n");
			var oModel = new JSONModel({
				selectedKey : "All",
				items : [{
					name : i18n.getProperty("All"),
					key : "All"
				},{
					name : i18n.getProperty("Works"),
					key : "Success"
				},{
					name : i18n.getProperty("OnHold"),
					key : "Warning"
				},{
					name : i18n.getProperty("Broken"),
					key : "Error"
				}]
			});
			return oModel;
		},
		
		createRequestFiltersModel: function() {
			var i18n = this.getOwnerComponent().getModel("i18n");
			var oModel = new JSONModel({
				selectedKey : "All",
				items : [{
					name : i18n.getProperty("All"),
					key : "All"
				},{
					name : i18n.getProperty("Done"),
					key : "Success"
				},{
					name : i18n.getProperty("Works"),
					key : "Warning"
				},{
					name : i18n.getProperty("Open"),
					key : "Error"
				}]
			});
			return oModel;
		},

		
		createMapDataModel : function(){
			var oModel = new JSONModel({
				spots: [],
				routes: [],
				areas: [],
				centerPosition : "27.554899;53.904651",
				initialZoom: 7,
				backButtonVisible : false
			});
			return oModel;
		}

	};
});