$.xs = $.xs || {};
$.xs.requestUtil = {
	prepareUrl : function(url, parameters){
		var parametersArray = [];
		if(parameters){
			Object.keys(parameters).forEach(function(parameterName){
				if(parameters[parameterName]){
					parametersArray.push(parameterName + "=" + parameters[parameterName]);
				}
			});
			if(parametersArray.length > 0){
				return url + "?" + parametersArray.join("&");
			}
		}
		return url;
	},
	
	prepareResponse : function(responseBody){
		$.response.contentType = "application/json";
		$.response.setBody(JSON.stringify(responseBody));
	}
}