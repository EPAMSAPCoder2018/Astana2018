sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/epam/uiorders/model/models",
	"com/epam/uiorders/mock/mockServer"
], function (UIComponent, Device, models, MockServer) {
	"use strict";

	return UIComponent.extend("com.epam.uiorders.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {

			var oMockServer = MockServer.getInstance();
			oMockServer.start();
			document.title = this.getModel("i18n").getProperty("appTitle");
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

		}
	});
});