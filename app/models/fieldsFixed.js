import { DataTypes } from 'sequelize';
import sequelize from '../../config/db';

const APFieldsFixed = sequelize.define('APFieldsFixed', {
	id: {
		type: DataTypes.SMALLINT(6),
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	field_name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	field_code: {
		type: DataTypes.STRING,
		allowNull: false
	},
	field_type: {
		type: DataTypes.STRING,
		allowNull: false
	},
	field_hint: {
		type: DataTypes.TEXT,
		allowNull: false
	},
	special_type: {
		type: DataTypes.STRING,
		allowNull: false
	},
	field_constraints: {
		type: DataTypes.TEXT,
		allowNull: false
	},
	position: {
		type: DataTypes.SMALLINT(6),
		allowNull: false
	},
},
	{
		tableName: 'fields_fixed',
		timestamps: false
	}
);

export default APFieldsFixed;