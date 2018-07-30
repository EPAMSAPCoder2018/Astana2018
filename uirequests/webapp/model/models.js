sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
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