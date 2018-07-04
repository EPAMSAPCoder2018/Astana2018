sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},
		
		createTabHandlerModel: function() {
			var oModel = new JSONModel({
				selectedTabKey : "technics" // possible values technics and routes
			});
			return oModel;
		},
		
		createTechnicFiltersModel: function() {
			var oModel = new JSONModel({
				selectedKey : "All",
				items : [{
					name : "All",
					key : "All"
				},{
					name : "Active",
					key : "Success"
				},{
					name : "Not Active",
					key : "Warning"
				},{
					name : "Broken",
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
				initialZoom: 7
			});
			return oModel;
		}

	};
});