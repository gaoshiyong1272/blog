'use strict';
const faker = require('faker');
const {blog_tags, blog_articles, blog_re_article_tag} = require('./../models');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		for (let i =0 ; i < 500; i++) {
			let re = await blog_re_article_tag.create({
				articleId: faker.random.number({min: 20, max: 955}),
				tagId: faker.random.number({min: 1, max: 17})
			});
		}

		return new Promise((resolve, reject) => {
			resolve('ok')
		});

		/**创建tag**/
		// let dataList = [];
		// let data = ['HTML/CSS','JavaScript', 'nodejs',
		// 	'Vue.js', 'React.JS', 'Angular', 'jQuery', 'Bootstrap','Sass/Less',
		// 	'小程序','前端工具','CSS','HTML5','CSS3'
		// ];
		//
		// let data2 = ['PHP','SERVER','linux',...data];
		// for(let i = 0; i< data2.length; i++){
		// 	let temp = {
		// 		name: data2[i],
		// 		createdAt: new Date(),
		// 		updatedAt: new Date()
		// 	}
		// 	dataList.push(temp)
		// }
		//
		// return queryInterface.bulkInsert('blog_tags', dataList);
	},

	down: (queryInterface, Sequelize) => {
		return new Promise((resolve, reject)=> {
			resolve('ok')
		})
	}
};
