sap.ui.define([
	"sap/ui/base/Object"
], function (BaseObject) {
	return BaseObject.extend("com.epam.uiordersdetails.controller.ListSelector", {
		constructor: function () {
			var that = this;
			this._oWhenListHasBeenSet = new Promise(function (fnResolveListHasBeenSet) {
				this._fnResolveListHasBeenSet = fnResolveListHasBeenSet;
			}.bind(this));
			this.oWhenListLoadingIsDone = new Promise(function (fnResolve, fnReject) {
				this._oWhenListHasBeenSet.then(function (oList) {
					var items = oList.getItems();
					var it = that._oList.getItems();
					if (!items || items.length === 0) {
						fnReject({
							list: oList,
							error: true
						});
					}
					var oFirstListItem = oList.getBinding("items").getContexts()[0];
					if (oFirstListItem) {
						fnResolve({
							list: oList,
							firstListItem: oFirstListItem
						});
					} else {
						fnReject({
							list: oList,
							error: false
						});
					}
				});
			}.bind(this));
		},
		setBoundMasterList: function (oList) {
			this._oList = oList;
			this._fnResolveListHasBeenSet(oList);
		},
		selectListItem: function (sBindingPath) {
			this.oWhenListLoadingIsDone.then(
				function () {
					var oList = this._oList;
					var oSelectedItem;

					if (oList.getMode() === "None") {
						return;
					}

					oSelectedItem = oList.getSelectedItem();

					if (oSelectedItem && oSelectedItem.getBindingContext().getPath() === sBindingPath) {
						return;
					}

					oList.getItems().some(function (oItem) {
						if (oItem.getBindingContext() && oItem.getBindingContext().getPath() === sBindingPath) {
							oList.setSelectedItem(oItem);
							return true;
						}
					});

				}.bind(this));
		},

		clearMasterListSelection: function () {
			this._oWhenListHasBeenSet.then(function () {
				this._oList.removeSelections(true);
			}.bind(this));
		}

	});

});