/**
 * Created by shiyonggao on 2019/11/28.
 */
const mysql = require('mysql');
const conf = require('../config');

class client {
    constructor(){
        this.connect = null;
        this.db_setting = Object.assign({}, conf.mysql.setting);
    }

    init(){
        if(!this.connect) {
            try {
                this.connect = mysql.createConnection(this.db_setting);
                this.connect.connect();
            } catch(error){
                throw new Error(error);
            }
            return this.connect;
        }
        return this.connect;
    }
}

module.exports =  new client().init();
