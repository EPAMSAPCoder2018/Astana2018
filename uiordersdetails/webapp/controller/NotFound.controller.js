sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("com.epam.uiordersdetails.controller.NotFound", {
		onNavBack: function() {
			var sPreviousHash = sap.ui.core.routing.History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var bReplace = true; //Otherwise  we go backward with a forward history
				this.getRouter().navTo("master", {}, bReplace);
			}
		}

	});

});