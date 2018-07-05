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
		
		createRequestFiltersModel: function() {
			var oModel = new JSONModel({
				selectedKey : "All",
				items : [{
					name : "All",
					key : "All"
				},{
					name : "Done",
					key : "Success"
				},{
					name : "In process",
					key : "Warning"
				},{
					name : "Open",
					key : "Error"
				}]
			});
			return oModel;
		}

	};
});