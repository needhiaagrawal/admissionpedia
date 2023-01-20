import { DataTypes } from 'sequelize';
import sequelize from '../../config/db';
import School from './school';
import Class from './classes';
import User from './user';

const APFormsSubmissions = sequelize.define('APFormsSubmissions', {
	id: {
		type: DataTypes.STRING(12),
		allowNull: false,
		primaryKey: true
	},
	school_id: {
		type: DataTypes.STRING(15),
		allowNull: false,
        // references: {
		// 	model: School,
		// 	key: 'id'
		// }
	},
	class_id: {
		type: DataTypes.SMALLINT(6),
		allowNull: false,
        // references: {
		// 	model: Class,
		// 	key: 'id'
		// }
	},
	user_id: {
		type: DataTypes.SMALLINT(6),
		allowNull: false,
        // references: {
		// 	model: User,
		// 	key: 'id'
		// }
	},
	status: {
		type: DataTypes.TINYINT(4),
        allowNull: false,
		defaultValue: 0,
	},
	payment_status: {
		type: DataTypes.TINYINT(4),
        allowNull: false,
		defaultValue: 0,
	},
	created: {
		type: DataTypes.DATE,
        allowNull: false,
	},
},
	{
		tableName: 'ap_forms_submissions',
		timestamps: false
	});

export default APFormsSubmissions;

// APFormsSubmissions.belongsTo(School, { as: 'school', foreignKey: 'school_id' }); 
// APFormsSubmissions.belongsTo(Class,  { as: 'className', foreignKey: 'class_id'});
// APFormsSubmissions.belongsTo(User, { as: 'user', foreignKey: 'user_id' }); 