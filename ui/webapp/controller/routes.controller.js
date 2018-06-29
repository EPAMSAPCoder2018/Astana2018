sap.ui.define([
		"com/epam/ui/controller/base.controller"
	], function(BaseController) {
	"use strict";
	return BaseController.extend("com.epam.ui.controller.routes", {
		onInit : function (){
			BaseController.prototype.onInit.apply(this, arguments);
			var oMap = this.getMapControl();
		}
	});
});