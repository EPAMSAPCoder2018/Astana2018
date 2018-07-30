sap.ui.define([], function () {
	"use strict";
	return {
		createPeriodicalyTask: function (taskToExecute, delay) {
			var timer;
			var start = function () {
				function run() {
					taskToExecute();
					timer = setTimeout(run, delay);
				};
				taskToExecute();
				timer = setTimeout(run, delay);
			};
			return {
				start: start,
				stop: function () {
					if (timer) {
						clearTimeout(timer);
						timer = null;
					}
				}
			};
		}
	};
});