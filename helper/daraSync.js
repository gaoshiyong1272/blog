/**
 * 异步数据加载管理器
 */
class DataSunc {
	constructor(){
		this.eventNames = [];
		this.data = {};
		this.dataStatus = {};
		this.callback = null;
	};

	checkout(){
		var done = true;
		for(var key in this.dataStatus){
			if(!this.dataStatus[key]) {
				done = false;
				break;
			}
		}
		if(done) {
			this.callback(this.data);
		}else{
			//console.log('未完成加载,data=>',this.data);
		}
	}

	createDataObj() {
		var len = this.eventNames.length;
		for (var i = 0; i < len; i++) {
			this.data[this.eventNames[i]] = null;
			this.dataStatus[this.eventNames[i]] = false;
		}
	}

	init(eventNames = [], callback) {
		this.eventNames = eventNames;
		this.callback = callback;
		this.createDataObj();
		return this;
	}

	commit(eventName, data) {
		this.data[eventName] = data;
		this.dataStatus[eventName] = true;
		this.checkout();
	}

}

module.exports = new DataSunc();
