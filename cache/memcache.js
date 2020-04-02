/**
 * Created by shiyonggao on 2019/11/28.
 */
const Cache = require('memcached');
const conf = require('../config');

class Memcache {
    constructor(){
        this.host = '127.0.0.1';
        this.port = '11211';
        this.client = null;
        this.type = '';
        this.keyword = '';
        this.value = '';
        if(conf.memcache) {
            if(conf.memcache.port){
                this.port = conf.memcache.port;
            }

            if(conf.memcache.host) {
                this.host = conf.memcache.host;
            }
        }

        this.init();
    }

    checkVal (val){
        if(typeof val === 'object') {
            val = JSON.stringify(val);
        }
        return val;
    }

    query(){
        return new Promise((resolve, reject) => {
            var handle = (err, data) => {
                if(err){
                    reject(err, data);
                }

                if(data === null) {
                    resolve(null);
                }

                try{
                    resolve(JSON.parse(data));
                }catch (e) {
                    resolve(data);
                }
            };

            if(this.type === 'get'){
                this.client.get(this.keyword, handle);
            }

            if(this.type === 'set' || this.type === 'replace' || this.type === 'add'){
                this.client[this.type](this.keyword, this.value, this.lifetime, handle);
            }

            if(this.type === 'remove') {
                this.client.del(this.keyword, handle);
            }

            if(this.type === 'incr' || this.type === 'decr'){
                this.client[this.type](this.keyword, this.value, handle);
            }
        });
    }

    getClient(){
        return this.client;
    }

    init(){
        try{
            this.client = new Cache(`${this.host}:${this.port}`);
        }catch (error) {
            throw new Error(error);
        }
    }

    set(key , value , lifetime){
        this.type = 'set';
        this.keyword = key;
        this.value = this.checkVal(value);
        this.lifetime = lifetime;
        return this.query();
    }

    replace(key, value, lifetime) {
        this.type = 'replace';
        this.keyword = key;
        this.value = this.checkVal(value);
        this.lifetime = lifetime;
        return this.query();
    }

    add(key, value, lifetime) {
        this.type = 'replace';
        this.keyword = key;
        this.value = this.checkVal(value);
        this.lifetime = lifetime;
        return this.query();
    }

    /**
     * 获取数据
     * @param keys array|string
     */
    get(keys = []){
        this.type = 'get';
        this.keyword = keys;
        if(typeof keys === 'string'){
            this.keyword = [keys]
        }
        return this.query();
    }

    /**
     * 数量自增
     * @param key
     * @param amount int 自增数量
     */
    incr(key , amount){
        this.type = 'incr';
        this.keyword = key;
        this.value = typeof parseInt(amount) === 'number' ? amount : 1;
        this.query();
    }

    /**
     * 数量自减
     * @param key
     * @param amount int 自增自减
     */
    decr(key, amount){
        this.type = 'decr';
        this.keyword = key;
        this.value = typeof parseInt(amount) === 'number' ? amount : 1;
        this.query();
    }

    remove(key){
        this.type = 'remove';
        this.keyword = key;
        this.query();

    }
}

module.exports = new Memcache();
