import { DataTypes } from 'sequelize';
import sequelize from '../../config/db';

const APClass = sequelize.define('APClass', {
	id: {
		type: DataTypes.SMALLINT(6),
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	in_group: {
		type: DataTypes.ENUM('S', 'C', 'P', 'U', 'V'),
		allowNull: false
	},
	position: {
		type: DataTypes.SMALLINT(6),
		allowNull: false
	},
},
	{
		tableName: 'ap_classes',
		timestamps: false
	}
);

export default APClass;