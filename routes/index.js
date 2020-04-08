var express = require('express');
var router = express.Router();
var createQueryBuilder = require('../database');


/* GET home page. */
router.get('/', async function (req, res, next) {
	var tag = res.$module['blog_tags'];
	var counts = await tag.findAll({where: {id: 1},
		include: [
			{
				model: res.$module['blog_articles'],
				through: {}
			}
		],

	});
	console.log(counts)
	res.render('test', {data: counts});

	return ;

	var time = req.$helpers.time({b: 2});
	var data = [{name: 'gaoshiyong', age: 20}];
	var data2 = [{name: 'gaoshiyong1272', age: 30}];
	var count = 0;


	/**数据管理器**/
	var datSync = req.$helpers.dataSync.init(
		['cdata', 'count', 'time'],
		(data) => {
			res.render('index', {title: 'Express', data});
		});


	datSync.commit('count', 130);

	req.$cache.set('foo', JSON.stringify(data), 10000)
		.then((res) => {
			console.log(res);
		});

	req.$cache.replace('foo', JSON.stringify(data2), 10000)
		.then(() => {
			req.$cache.get('foo')
				.then((res) => {
					datSync.commit('cdata', res['foo']);
					console.log(res['foo']);
				});
		});

	// req.$cache.get('foo')
	// 	.then((res) => {
	// 		datSync.commit('cdata', res['foo']);
	// 		console.log(res['foo']);
	// 	});

	/**查询**/
	// var db = createQueryBuilder();
	// db.select()
	// 	.from('users')
	// 	.where('name', '=:name')
	// 	.andWhere('id', '> 20')
	// 	.setParameter('name','gaoshiyong')
	// 	.orderBy('id')
	// 	.limit(0,30)
	// 	.getSql();

	/**更新**/
	// var dbs = createQueryBuilder();
	// dbs.update('users',{name: 'gaoshiyong1272'})
	// 	.where('id', '=:id')
	// 	.setParameter('id', 20)
	// 	.save()
	// 	.then((res)=>{
	// 		console.log(res);
	// 	}).catch((res)=>{
	//
	// });


	/**新增**/
	// var insert = createQueryBuilder();
	// insert.insert('users', [{
	// 	name: 'dashabifeng',
	// 	age: 10000,
	// 	desc: 'asdfasdfasdfasdf',
	// 	date: parseInt(new Date().getTime() / 1000)
	// }, {name: 'wangxiaoya', age: 40, desc: 'asdfasdfasdfasdf', date: parseInt(new Date().getTime() / 1000)}])
	// 	.save()
	// 	.then((res) => {
	// 		console.log(JSON.stringify(res));
	// 	}).catch((res) => {
	// 		console.log(res);
	// });


	/**新增**/
	// var rm = createQueryBuilder();
	// rm.delete('users')
	// 	//.where('id','=:id')
	// 	.setParameter('id', 18)
	// 	.remove()
	// 	.then((res) => {
	// 		console.log(JSON.stringify(res));
	// 	}).catch((res) => {
	//
	// });

	// /**查询一条数据**/
	// createQueryBuilder()
	// 	.findById('users',['id',6])
	// 	.then((res) => {
	// 		console.log(JSON.stringify(res[0]));
	// 	});


	/**时间**/
	datSync.commit('time', time);

});

router.get('/get-session', function (req, res, next) {
	const session = req.session;
	if (!session.number) {
		session.number = 0;
	}
	session.number++;

	res.json({
		number: session.number
	});
});

module.exports = router;
