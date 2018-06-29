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
		}

	};
});