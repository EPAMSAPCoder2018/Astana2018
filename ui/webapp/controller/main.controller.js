sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"com/epam/ui/model/models"
	], function(Controller, Models) {
	"use strict";
	return Controller.extend("com.epam.ui.controller.main", {
		onInit : function (){
			this.getView().setModel(Models.createTabHandlerModel(), "tabHandlerModel");
		},
		onAfterRendering : function(){
			
		},
		onSelectTab: function (event) {
			var selectedKey = event.getParameter('selectedKey');
		//	this.getView().getModel("device").setProperty("selectedTabKey", selectedKey);
			
		}
	});
});