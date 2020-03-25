let args = process.argv.splice(2);
const path = require('path');
const config = require('../config');
const fs = require("fs");
const template = require('./pack-templates/js-template');
const autoload = require('./autoload');

//参数处理
let reg = /^(file=|helper=)[a-zA-Z-_\/]{3,}$/;
let parseArgsinfo = [];
let parseArgs = () => {
    let param = args[0];
    if (reg.test(param)) {
        let arr = param.split('=');
        parseArgsinfo.push(arr[0], arr[1]);
        return true;
    } else {
        console.log('Pass params is error, example: v=index or m=index');
        return false;
    }
};


/**
 * 生成目录
 * @param dirname
 * @returns {boolean}
 */
let mkdirsSync = dirname => {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
};

let createVueFile = () => {
    if(parseArgs()){
        let moduleType = parseArgsinfo[0];
        let moduleName = parseArgsinfo[1];

        /**
         * 生成module.exports={}
         */
        if(moduleType === 'file'){
            if (fs.existsSync(path.join(config.build.helperDirectory, `${moduleName}.js`))) {
                console.log(`Create fileName=>${moduleName} is exists`);
                return;
            }

            let name = moduleName;
            let content = template.getJsTamelate('m');

            /**有目录先创建目录**/
            let arr = moduleName.split('/');
            if (arr.length > 1) {
                let pathArr = arr.slice(0, -1).join('/');
                mkdirsSync(path.join(__dirname, `../${pathArr}`));
            }

            /**写文件**/
            let fd = fs.openSync(path.join(__dirname, `../${name}.js`), 'w');
            fs.writeFileSync(fd, content);
            fs.closeSync(fd);

            console.log(`Create fileName=>${moduleName}.js is successfully`, '\n');
        }

        if(moduleType === 'helper'){
            if(fs.existsSync(path.join(config.build.helperDirectory, `${moduleName}.js`))){
                console.log(`Create fileName=>${moduleName} is exists`);
                return;
            }

            let name = moduleName;
            let pathModule = moduleName;

            /**有目录先创建目录**/
            let arr = moduleName.split('/');
            if (arr.length > 1) {
                let pathArr = arr.slice(0, -1).join('/');
                mkdirsSync(path.join(config.build.helperDirectory, `${pathArr}`));

                let temp = '';
                let arrs = moduleName.split('/');
                let len = arrs.length;
                for (let i = 0; i < len; i++) {
                    if (i === 0) {
                        temp = arr[i];
                    } else {
                        temp += arrs[i].replace(arrs[i][0], arrs[i][0].toLocaleUpperCase());
                    }
                }
                pathModule = temp;
            }

            let content = template.getJsTamelate('i', {name: pathModule});

            /**写文件**/
            let fd = fs.openSync(path.join(config.build.helperDirectory, `${name}.js`), 'w');
            fs.writeFileSync(fd, content);
            fs.closeSync(fd);
            console.log(`Create fileName=>${moduleName}.js is successfully`, '\n');
        }
    }
};

createVueFile();
