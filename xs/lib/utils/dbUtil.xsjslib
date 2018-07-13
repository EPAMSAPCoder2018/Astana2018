$.xs = $.xs || {};
$.xs.dbUtil = {
	getConnection : function(){
		var connection = $.hdb.getConnection();
		return connection;
	},
	clone : function(obj){
		return JSON.parse(JSON.stringify(obj));
	}
};