$.xs = $.xs || {};
$.xs.properties = {
	"google" : {
		"apiKey" : "AIzaSyDegNj-wxQ3dNGOykVCZj6UJF_7aTgEfNw",
		"apiUrl" : "https://maps.googleapis.com/maps/api/directions/json"
	},
	"iot" : {
		"apiUrl" : "https://iots0019634792trial.hanatrial.ondemand.com/iot/xsjs"
	}
};
$.xs.properties.get = function(key, defaultValue) {
	var pathParts = key.split(".");
	var property = null;
	pathParts.forEach(function(pathPart){
		if(property === null){
			if($.xs.properties[pathPart]){
				property = $.xs.properties[pathPart];
			} else {
				throw {
					massage : "Property " + pathPart + " is not defined in " + key + " property"
				};
			}
		} else {
			if(property[pathPart]){
				property = property[pathPart];
			} else {
				throw {
					massage : "Property " + pathPart + " is not defined in " + key + " property"
				};
			}
		}
	});
	if(property !== null){
		return property;
	}
	return defaultValue !== undefined ? defaultValue : null;
}