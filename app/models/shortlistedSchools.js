import { DataTypes } from 'sequelize';
import sequelize from '../../config/db';
import School from './school';

const ShortlistedSchool = sequelize.define('ShortlistedSchool', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	user_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
        // need to add reference later for userid
	},
    school_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
        references: {
			model: School,
			key: 'id'
		}
	},
    notification_flag: {
		type: DataTypes.TINYINT(4),
        allowNull: false,
	},
	created: {
		type: DataTypes.DATE,
        allowNull: false,
	},
	updated: {
		type: DataTypes.DATE,
        allowNull: false,
		defaultValue: Sequelize.literal('NOW ON UPDATE NOW'),
	},
},
	{
		tableName: 'ap_shortlisted_schools',
		timestamps: false
	});

export default ShortlistedSchool;