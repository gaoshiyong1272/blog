/**
 * Created by shiyonggao on 2019/11/28.
 */
const config = {
    memcache : {
        host : '127.0.0.1',
        port : '11211'
    },

    mysql: {
        setting:{
            host: 'localhost',              //本地数据库
            port: '3306',
            user: 'root',                   //数据库用户名
            password: '123456',             //数据库密码
            database: 'test',                //数据库名称
            supportBigNumbers: true        //处理大数据量建议启用该项
        },
        showSql: false, //控制台是否显示sql
        timeout: 5000, // 超时设置
    }
};

module.exports = config;
