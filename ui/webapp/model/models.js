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
					name : "In Process",
					key : "I"
				},{
					name : "Completed",
					key : "D"
				},{
					name : "Planned",
					key : "P"
				}],
				selectedDeviceKey : "All",
				devices : [{
					name : "All",
					key : "All"
				},{
					name : "Snowplow",
					key : "SNOWPLOW"
				},{
					name : "Salt spreader",
					key : "SALT_SPREADER"
				},{
					name : "Brushes",
					key : "BRUSH"
				}]
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