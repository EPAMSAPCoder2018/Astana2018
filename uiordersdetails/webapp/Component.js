sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/epam/uiordersdetails/model/models",
	"com/epam/uiordersdetails/controller/ListSelector",
	"com/epam/uiordersdetails/mock/mockServer",
	"com/epam/uiordersdetails/util/utils"
], function (UIComponent, Device, models, ListSelector, MockServer, Utils) {
	return UIComponent.extend("com.epam.uiordersdetails.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			var that = this;
			var oMockServer = MockServer.getInstance();
			oMockServer.start();
			this.oListSelector = new ListSelector();
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			this.getRouter().initialize();
		}
	});
});