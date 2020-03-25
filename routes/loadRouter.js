var rreaddir = require('recursive-readdir-sync');
var path = require('path');
var routerDir = [];
routerDir = rreaddir(__dirname);
var routers = {};
routerDir.forEach(dir => {
	/**获取文件名称及其后缀**/
	dir = path.relative(__dirname, dir);
	let result = (/(.*)\.js$/).exec(dir);
	if (result) {
		let name = `${result[1]}`;
		if (name !== 'loadRouter' && name !== 'vendor' && name !== 'commons') {
			routers[name] = path.join(__dirname, dir);
		}
	}
});

//console.log(routers);

module.exports = {
	init(app){
		for(var router in routers){
			var tempRouter = require(routers[router]);
			if(router.indexOf('index') !== -1) {
				var routerName = `/${router.replace(/index/,'')}`;
				app.use(routerName, tempRouter);
			}else{
				var routerName = `/${router}`;
				app.use(routerName, tempRouter);
			}
		}
	}
};
