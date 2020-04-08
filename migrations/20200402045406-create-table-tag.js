'use strict';
const {id, timestamp} = require('./../common/db_auto_field');

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('blog_tags', {
			...id(),
			name: {
				type: Sequelize.STRING(20),
				allowNull: false,
				unique: true
			},
			...timestamp()
		}).then(()=>{
			queryInterface.addIndex('blog_tags',['name'])
		});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('blog_tags');
	}
};
