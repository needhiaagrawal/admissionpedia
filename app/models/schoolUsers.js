import { DataTypes } from 'sequelize';
import sequelize from '../../config/db';
import School from './school';

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
	type: DataTypes.ENUM('user', 'admin'),
},
{
	tableName: 'ap_school_users',
	timestamps: false
});

SchoolUser.belongsTo(School, { as: 'school', foreignKey: 'school_id' });

export default SchoolUser;
