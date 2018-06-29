$.xs = $.xs || {};
$.xs.dbUtil = {
	getConnection : function(){
		var connection = $.hdb.getConnection();
		return connection;
	}
}