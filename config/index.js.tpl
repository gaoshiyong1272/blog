/**
 * Created by shiyonggao on 2019/11/28.
 */
const config = {
    memcache : {
        host : '127.0.0.1',
        port : '11211'
    }

    mysql: {
        host: 'localhost',              //本地数据库
        port: '3306',
        user: 'root',                   //数据库用户名
        password: '123456',             //数据库密码
        database: 'test',                //数据库名称
        supportBigNumbers: true        //处理大数据量建议启用该项
    }
};

module.exports = config;
