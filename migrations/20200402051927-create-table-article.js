'use strict';
const {id,timestamp} = require('./../common/db_auto_field');

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('blog_articles', {
			...id(),
			title: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			author: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			best: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			recommend:{
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			pv: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 1,
			},
			content:{
				type: Sequelize.TEXT,
				allowNull: false,
			},
			...timestamp(true,true)
		});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('blog_articles');
	}
};
