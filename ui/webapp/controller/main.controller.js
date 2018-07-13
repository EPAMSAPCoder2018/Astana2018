sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"com/epam/ui/model/models"
	], function(Controller, Models) {
	"use strict";
	return Controller.extend("com.epam.ui.controller.main", {
		onInit : function (){
			var model = Models.createTabHandlerModel();
			this.getView().setModel(model, "tabHandlerModel");
			this._currentTabView = this.getView().byId(model.getProperty("/selectedTabKey"));
		},
		onAfterRendering : function(){
			
		},
		onSelectTab: function (event) {
			var selectedKey = event.getParameter('selectedKey');
			var nextView = this.getView().byId(selectedKey);
			this._currentTabView.getController().onHideView({nextView : nextView});
			this._currentTabView = nextView;
		}
	});
});