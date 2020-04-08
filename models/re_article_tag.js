'use strict';
module.exports = (sequelize, DataTypes) => {
	const Tag = sequelize.define('blog_re_article_tag', {
		blogArticleId: DataTypes.INTEGER,
		blogTagId: DataTypes.INTEGER,
	},{
		tableName: 'blog_re_article_tag',
		freezeTableName: true,
		timestamps: false,
		underscored: false
	});

	Tag.associate = function (models) {
		//Tag.belongsToMany(models.blog_articles, {through: 'blog_re_article_tag'});
	};
	return Tag;
};
