'use strict';
const faker = require('faker');
const { blog_tags, blog_articles, blog_re_article_tag } = require('./../models/');


module.exports = {
	up: async (queryInterface, Sequelize) => {

		return new Promise((resolve, reject) => {
			resolve('ok')
		});

		for (let i = 0; i < 1000; i++) {
			let temp = {
				title: faker.name.title(),
				author: `${faker.name.firstName()}${faker.name.lastName()}`,
				best: faker.random.number({min: 1, max: 100}),
				recommend: faker.random.number({min: 0, max: 1}) ? false : true,
				pv: faker.random.number({min: 1, max: 1000}),
				content: faker.lorem.sentences(20),
			};
			let art = await blog_articles.create(temp);
			let re = await blog_re_article_tag.create({
				articleId: art.id,
				tagId: faker.random.number({min: 1, max: 17})
			});
		}

		return new Promise((resolve, reject) => {
			resolve('ok')
		});

	},

	down: (queryInterface, Sequelize) => {

	}
};
