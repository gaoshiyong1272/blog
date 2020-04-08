const Sequelize = require('sequelize');

const id = (primaryKey=true)=>{
	let temp = {};
	temp['id'] = {
		type: Sequelize.INTEGER,
		unique: true,
		autoIncrement: true
	};
	if(primaryKey) temp['id']['primaryKey'] = true;
	return temp;
};

const timestamp = (humpCode= true, del = false)=> {
	let created = humpCode ? 'createdAt': 'created_at';
	let updated = humpCode ? 'updatedAt' : 'updated_at';
	let deleted = humpCode ? 'deletedAt' : 'deleted_at';
	let temp = {};
	temp[created] = {
		type: Sequelize.DATE
	};
	temp[updated] = {
		type: Sequelize.DATE
	};

	if(del) {
		temp[deleted] = {
			type: Sequelize.DATE,
			allowNull: true
		};
	}
	return temp;
};

module.exports =  {
	id,
	timestamp
};
