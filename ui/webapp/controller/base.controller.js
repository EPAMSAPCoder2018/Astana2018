sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/m/Text'
], function (Controller, Text) {
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
		
		onAfterRendering : function(){
			var oMap = this.getMapControl();
			if (!this._spotDetailPointer) {
				var textView = new Text(this.createId("SpotDetailPointer"));
				var contentId = oMap.getId() + "-geoscene-winlayer";
				var cont = document.getElementById(contentId);
				var rm = sap.ui.getCore().createRenderManager();
				rm.renderControl(textView);
				rm.flush(cont);
				rm.destroy();
				this._spotDetailPointer = textView;
			}
		},
		
		onZoomChanged : function(evt){
			if (this._oPopover) {
				this._oPopover.close();
			}
		},
		
		onExit : function () {
			if (this._oPopover) {
				this._oPopover.destroy();
			}
		},

		getMapControl: function () {
			return this.getView().byId("vbi");
		},

		onLegendItemClick: function (evt) {

		}
	});
});