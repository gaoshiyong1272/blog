var client = require('./mysql');
var Helpers = require('../helper');
var conf = require('../config');
var lodash = require('lodash');

class Index  {
	constructor(){
		this.sql = '';
		this.selectSQL = "SELECT ?? FROM ?? @where@ @groupBy@ @orderBy@ @limit@";
		this.sqlData = [];
		this.table = '';
		this.fields = [];
		this.whereData = {};
		this.whereDataMap = {};
		this.whereDataStr = {};
		this.updateSQL = "UPDATE @table@ SET @updateData@ @where@";
		this.deleteSQl = "DELETE FROM @table@ @where@";
		this.insertSQL = "INSERT INTO @table@(@fields@) VALUES ? ";
		this.orderByData = {};
		this.groupByData = {};
		this.type = '';

		this.updateData = {};

		this.insertData = [];
		this.insertFields = [];


		this.reg = /^(=|= |>=|>= |<=|>|> |<|< )[a-zA-Z0-9\.]+$/;
		this.timeout = conf.mysql.timeout === undefined ? 10000 : conf.mysql.timeout;
		this.msg = {
			table: '数据表不能为空',
			fields: '操作查询字段不能为空',
			where: '操作条件不能为空',
			values: '插入值不能为空',
			id: 'ID必须为数字'
		}

	}

	createwhere(){
		/**无条件查询处理**/
		if(lodash.size(this.whereDataStr) === 0) {
			this.sql = this.sql.replace('@where@', '');
			return;
		}

		var tempWhereDataStr = [];
		for(var key in this.whereDataStr){
			tempWhereDataStr.push(this.whereDataStr[key]);
		}
		this.sql = this.sql.replace('@where@', 'WHERE ' + tempWhereDataStr.join(' '));
		var tempWhereDataArr = [];
		for(var k in this.whereData) {
			tempWhereDataArr.push(k);
			tempWhereDataArr.push(this.whereData[k]);
		}
		this.sqlData = this.sqlData.concat(tempWhereDataArr);
	}

	createOrderBy(){
		/**无排序处理**/
		if (lodash.size(this.orderByData) === 0) {
			this.sql = this.sql.replace('@orderBy@', '');
			return;
		}
		this.orderByDataArr= [];
		for(var key in this.orderByData) {
			this.orderByDataArr.push(this.orderByData[key]);
		}
		this.sql = this.sql.replace('@orderBy@', 'ORDER BY ' + this.orderByDataArr.join(','));
	}

	createGroupBy() {
		/**无分组处理**/
		if (lodash.size(this.groupByData) === 0) {
			this.sql = this.sql.replace('@groupBy@', '');
			return;
		}
		this.groupByDataArr = [];
		for (var key in this.groupByData) {
			this.groupByDataArr.push(this.groupByData[key]);
		}
		this.sql = this.sql.replace('@groupBy@', 'GROUP BY ' + this.groupByDataArr.join(','));
	}

	getSql(){
		//console.log('显示sql=>', '\n', this.sql, '\n', this.whereDataStr, '\n' , this.whereData, '\n', this.whereDataMap);

		if(this.type === 'select') {
			this.sqlData = [this.fields, this.table];
			this.createwhere();
			this.createOrderBy();
			this.createGroupBy();
			this.sql = client.format(this.sql, this.sqlData);
		}

		if(this.type === 'update'){
			this.sql = this.sql.replace('@table@',this.table);
			this.createwhere();
			this.sql = client.format(this.sql, this.sqlData);
			this.sql = this.sql.replace('@updateData@','?')
		}

		if(this.type === 'insert'){
			this.sql = this.sql.replace('@table@', this.table);
		}

		if(this.type === 'delete') {
			this.sql = this.sql.replace('@table@', this.table);
			this.createwhere();
			this.sql = client.format(this.sql, this.sqlData);
		}

		console.log('sql=>', this.sql);
	}

	andWhere(field, value){
		if (value.indexOf(':') !== -1) {
			var val = value.split(':');
			this.whereDataStr[field] = `AND ?? ${this.tirm(val[0])} ?`;
			this.whereDataMap[this.tirm(val[1])] = field;
			this.whereData[field] = null;
		} else {
			var qu = value.match(this.reg)[1];
			var temp = value.split(qu);
			this.whereData[field] = this.tirm(temp[1]);
			this.whereDataStr[field] = `AND ?? ${this.tirm(qu)} ?`;
		}
		return this;
	}

	where(field, value){
		if(value.indexOf(':') !== -1) {
			var val = value.split(':');
			this.whereDataStr[field] = `?? ${this.tirm(val[0])} ?`;
			this.whereDataMap[this.tirm(val[1])] = field;
			this.whereData[field] = null;
		}else{
			var qu = value.match(this.reg)[1];
			var temp = value.split(qu);
			this.whereData[field] = this.tirm(temp[1]);
			this.whereDataStr[field] = `?? ${this.tirm(qu)} ?`;
		}
		return this;
	}

	orWhere(field, value){
		if (value.indexOf(':') !== -1) {
			var val = value.split(':');
			this.whereDataStr[field] = `OR ?? ${this.tirm(val[0])} ?`;
			this.whereDataMap[this.tirm(val[1])] = field;
			this.whereData[field] = null;
		} else {
			var qu = value.match(this.reg)[1];
			var temp = value.split(qu);
			this.whereData[field] = this.tirm(temp[1]);
			this.whereDataStr[field] = `OR ?? ${this.tirm(qu)} ?`;
		}
		return this;
	}

	from(table){
		if(!table) {
			this.error('table');
			return this;
		}
		this.table = table;
		return this;
	}

	setParameter(field, value){
		if (lodash.size(this.whereData) === 0) {
			this.error('where');
			return this;
		}
		this.whereData[this.whereDataMap[field]] = value;
		return this;
	}

	orderBy(field , sort = 'ASC'){
		if(field) {
			field = client.escapeId(field);
			this.orderByData[field] = `${field} ${sort}`;
		}
		return this;
	}

	groupBy(field){
		if (field) {
			field = client.escapeId(field);
			this.groupByData[field] = `${field}`;
		}
		return this;
	}

	limit(start,count = 20){
		if(start === undefined) {
			this.sql = this.sql.replace('@limit@','')
		}else{
			this.sql = this.sql.replace('@limit@', `LIMIT ${start},${count}`);
		}
		return this;
	}

	select(fields = []){
		this.type = 'select';
		this.sql = this.selectSQL;
		if(fields.length === 0) {
			fields = ['*'];
		}
		this.fields = fields;
		return this;
	}

	/**
	 * 查询一条数据
	 * @param table
	 * @param data ['id', 1] or [1]
	 */
	findById(table, data = []) {
		var id = 'id',
			val;

		if (!table) {
			this.error('table');
			return;
		}

		if(data.length === 0) {
			this.error('fields');
			return;
		}

		if (data.length === 1) {
			val = data[0];
		}

		if (data.length === 2) {
			id = data[0];
			val = data[1];
		}

		var sql = "SELECT * FROM ?? WHERE ?? = ?";
		var inserts = [table, id, val];
		sql = client.format(sql, inserts);
		console.log(sql);
		return this.query(sql);
	}

	update(table , values) {
		this.type = 'update';
		this.table = client.escapeId(table);
		this.sql = this.updateSQL;
		if(!table) {
			this.error('table');
			return this;
		}
		if(lodash.size(values) === 0){
			this.error('values');
			return this;
		}
		for(var key in values) {
			this.updateData[key] = values[key];
		}
		return this;
	}

	save(){
		if(this.type === 'update' && lodash.size(this.whereData) === 0){
			this.error('where');
			return;
		}

		var data = {};
		if(this.type === 'update') {
			data = this.updateData;
		}

		if(this.type === 'insert'){
			data = this.insertData;
		}
		this.getSql();
		console.log(this.sql, data);
		return new Promise((resolve, reject) => {
			client.query(this.sql, [data], (...results) => {
				if (results.err) reject(results.err);
				else resolve(results);
			})
		});
	}

	remove(){
		if (lodash.size(this.whereData) === 0) {
			this.error('where');
			return;
		}
		this.getSql();
		console.log(this.sql, this.whereData);
		//return this.query(this.sql);
	}

	createInsertData(values){
		var count = 0;
		for(var key in values){
			var temp = [];
			for(var k in values[key]){
				if(count === 0) {
					this.insertFields.push(client.escapeId(k));
				}
				temp.push(values[key][k]);
			}
			this.insertData.push(temp);
			count++;
		}

		this.sql = this.sql.replace('@fields@', this.insertFields.join(','))
	}

	/**
	 *
	 * @param table
	 * @param values []
	 * @returns {Index}
	 */
	insert(table, values = []) {
		this.type = 'insert';
		this.table = client.escapeId(table);
		this.sql = this.insertSQL;
		if (!table) {
			this.error('table');
			return this;
		}
		if (lodash.size(values) === 0) {
			this.error('values');
			return this;
		}
		this.createInsertData(values);
		return this;

	}

	delete(table) {
		this.type = 'delete';
		this.table = client.escapeId(table);
		this.sql = this.deleteSQl;

		if (!table) {
			this.error('table');
			return this;
		}

		return this;
	}

	getResult(){

	}


	escape(str) {
		return client.escape(str);
	}

	/**
	 * 检查服务是否链接成功
	 * @param callback
	 */
	ping(callback) {
		client.ping(function (err) {
			if (err) {
				throw new Error(err);
			} else {
				if (typeof callback == 'function') callback('Server responded to ping');
			}
		});
	}

	error(type) {
		if (this.msg[type]) {
			throw new Error(this.msg[type] ? this.msg[type] : '操作失败');
		}
	}

	query(sql) {
		return new Promise((resolve, reject) => {
			var timeout = this.timeout;
			client.query({sql, timeout}, (err, results) => {
				if (err) reject(err);
				else resolve(results);
			})
		});
	}

	tirm(s) {
		return s.replace(/^\s+|\s+$/gm, '');
	}
}


var createQueryBuilder = () => {
	return new Index ()
};

module.exports = createQueryBuilder;
