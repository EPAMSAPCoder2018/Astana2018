sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";
	return Controller.extend("com.epam.ui.controller.base", {
		onInit: function () {
			var oMap = this.getMapControl();
			var oMapConfig = {
				"MapProvider": [{
					"name": "GMAP",
					"Source": [{
						"id": "s1",
						"url": "https://mt.google.com/vt/lyrs=m&x={X}&y={Y}&z={LOD}"
					}]
				}],
				"MapLayerStacks": [{
					"name": "DEFAULT",
					"MapLayer": {
						"name": "layer1",
						"refMapProvider": "GMAP",
						"opacity": "1",
						"colBkgnd": "RGB(255,255,255)"
					}
				}]
			};
			oMap.setMapConfiguration(oMapConfig);
			oMap.setRefMapLayerStack("DEFAULT");
		},

		getMapControl: function () {
			return this.getView().byId("vbi");
		},
		
		getMapLegend: function() {
			return this.getMapControl().getLegend();
		},

		onLegendItemClick: function (evt) {

		},

		onZoomChanged: function (evt) {

		}
	});
});