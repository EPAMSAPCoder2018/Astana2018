sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createEmptyJSONModel: function () {
			var oModel = new JSONModel();
			return oModel;
		},

		createTabHandlerModel: function () {
			var oModel = new JSONModel({
				selectedTabKey: "routes" // possible values technics and routes and requests
			});
			return oModel;
		},

		createRoutesFiltersModel: function () {
			var oModel = new JSONModel({
				selectedKey: "All",
				items: [{
					name: "Все",
					key: "All"
				}, {
					name: "В работе",
					key: "I"
				}, {
					name: "Завершен",
					key: "D"
				}, {
					name: "Планируется",
					key: "P"
				}],
				selectedDeviceKey: "All",
				devices: [{
					name: "Все",
					key: "All"
				}, {
					name: "Снегоочиститель",
					key: "SNOWPLOW"
				}, {
					name: "Солеразбрасыватель",
					key: "SALT_SPREADER"
				}, {
					name: "Щетки",
					key: "BRUSH"
				}, {
					name: "Не определено",
					key: "NA"
				}]
			});
			return oModel;
		},

		createTechnicFiltersModel: function () {
			var oModel = new JSONModel({
				selectedKey: "All",
				items: [{
					name: "Все",
					key: "All"
				}, {
					name: "В работе",
					key: "Success"
				}, {
					name: "В ожидании",
					key: "Warning"
				}, {
					name: "Не исправна",
					key: "Error"
				}]
			});
			return oModel;
		},

		createRequestFiltersModel: function () {
			var oModel = new JSONModel({
				selectedKey: "All",
				items: [{
					name: "Все",
					key: "All"
				}, {
					name: "Завершен",
					key: "Success"
				}, {
					name: "В работе",
					key: "Warning"
				}, {
					name: "Открыт",
					key: "Error"
				}]
			});
			return oModel;
		},

		createMapDataModel: function () {
			var oModel = new JSONModel({
				spots: [],
				routes: [],
				areas: [],
				centerPosition: "27.554899;53.904651",
				initialZoom: 7,
				backButtonVisible: false
			});
			return oModel;
		}
	};
});