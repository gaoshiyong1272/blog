'use strict';
const {id,timestamp} = require('./../common/db_auto_field');

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('blog_comments', {
			...id(),
			nickName: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
				comment: "作者昵称"
			},
			ip:{
				type: Sequelize.STRING,
				allowNull: true,
				comment: "作者访问IP"
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
				comment: "作者邮箱"
			},
			content: {
				type: Sequelize.STRING(500),
				allowNull: false,
				comment: "评论内容"
			},
			articleId:{
				type: Sequelize.INTEGER,
				allowNull: false,
				comment: "文章id"
			},
			...timestamp()
		});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('blog_comments');
	}
};
