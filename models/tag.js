'use strict';
module.exports = (sequelize, DataTypes) => {
	const Tag = sequelize.define('blog_tags', {
		name: DataTypes.STRING,
		createdAt: DataTypes.DATE,
		updatedAt: DataTypes.DATE,
	},{
		freezeTableName: false,
		underscored: false
	});

	Tag.associate = function (models) {
		Tag.belongsToMany(models['blog_articles'], {through: 'blog_re_article_tag'});
	};
	return Tag;
};
