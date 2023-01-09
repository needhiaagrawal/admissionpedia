import { DataTypes } from 'sequelize';
import sequelize from '../../config/db';
import School from './school';

const User = sequelize.define('User', {
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
    auth_key: {
		type: DataTypes.STRING,
		allowNull: true
	},
    accessToken: {
		type: DataTypes.STRING,
		allowNull: true
	},
    mobile: {
        type: DataTypes.STRING(20),
		allowNull: false,
		unique: true
    },
    mobile_verification_code: {
		type: DataTypes.STRING(10),
		allowNull: true
	},
	email_verification_code: {
		type: DataTypes.STRING(10),
		allowNull: true
	},
    password_reset_code: {
		type: DataTypes.STRING(40),
		allowNull: true
	},
    mobile_verified: {
		type: DataTypes.TINYINT(4),
        allowNull: true,
	},
    email_verified: {
        type: DataTypes.TINYINT(4),
        allowNull: true, 
    },
    referring_school_id: {
        type: DataTypes.STRING(15),
        allowNull: true, 
        references: {
			model: School,
			key: 'id'
		}
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
	mobile_expiry_time: {
		type: DataTypes.DATE,
        allowNull: true,
	},
	password_expiry_time: {
		type: DataTypes.DATE,
        allowNull: true,
	},
},
	{
		tableName: 'ap_users',
		timestamps: false
	});

User.belongsTo(School, { as: 'school', foreignKey: 'referring_school_id' });

export default User;


