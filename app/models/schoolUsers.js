import { DataTypes } from 'sequelize';
import sequelize from '../../config/db';

const SchoolUser = sequelize.define('SchoolUser', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
    password: {
		type: DataTypes.STRING,
		allowNull: false
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
	},
    email_verified: {
        type: DataTypes.TINYINT(4),
        allowNull: true, 
    },
    school_id: {
        type: DataTypes.STRING(15),
        allowNull: true, 
    },
    temp_school_id: {
        type: DataTypes.STRING(15),
        allowNull: true, 
    },
	new_school: {
		type: DataTypes.BOOLEAN,
		allowNull: true
	},
	mobile: {
        type: DataTypes.STRING(20),
		allowNull: false,
		unique: true
    },
	status: {
		type: DataTypes.ENUM('Not Onboarded', 'Onboared', 'Not Active'),
	},
	created: {
		type: DataTypes.DATE,
        allowNull: false,
		defaultValue: sequelize.literal('NOW()'),

	},
	modified: {
		type: DataTypes.DATE,
        allowNull: false,
		defaultValue: sequelize.literal('NOW()'),
	},
	email_expiry_time: {
		type: DataTypes.DATE,
        allowNull: true,
	},
	type: DataTypes.ENUM('user', 'admin'),
},
{
	tableName: 'ap_school_users',
	timestamps: false
});

export default SchoolUser;
