'use strict';
const {id} = require('./../common/db_auto_field');
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('blog_re_article_tag', {
			...id(),
			blogArticleId: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			blogTagId: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
		}).then(() => {
			queryInterface.addIndex('blog_re_article_tag', ['blogArticleId','blogTagId'])
		});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('blog_re_article_tag');
	}
};
