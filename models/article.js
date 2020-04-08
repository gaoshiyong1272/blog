'use strict';
module.exports = (sequelize, DataTypes) => {
	const Article = sequelize.define('blog_articles', {
		title: DataTypes.STRING,
		author: DataTypes.STRING,
		best: DataTypes.INTEGER,
		recommend: DataTypes.BOOLEAN,
		pv: DataTypes.INTEGER,
		content: DataTypes.TEXT,
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
		deletedAt: DataTypes.DATE
	},{
		freezeTableName: true,
		underscored: false
	});
	Article.associate = function (models) {
		Article.belongsToMany(models['blog_tags'], {through: 'blog_re_article_tag'});
	};
	return Article;
};
