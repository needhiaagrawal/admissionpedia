import { DataTypes } from 'sequelize';
import sequelize from '../../config/db';
import School from './school';
import Class from './classes';

const SchoolClass = sequelize.define('SchoolClass', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	school_id: {
		type: DataTypes.STRING,
		allowNull: false,
        references: {
			model: School,
			key: 'id'
		}
	},
	class_id: {
		type: DataTypes.SMALLINT(6),
		allowNull: false,
        references: {
			model: Class,
			key: 'id'
		}
	},
},
	{
		tableName: 'ap_school_class_relation',
		timestamps: false
	});

export default SchoolClass;

