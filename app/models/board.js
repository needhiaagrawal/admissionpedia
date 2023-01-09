import { DataTypes } from 'sequelize';
import sequelize from '../../config/db';

const Board = sequelize.define('board', {
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
	country_id: {
		type: DataTypes.STRING,
		allowNull: false
	},
},
	{
		tableName: 'ap_boards',
		timestamps: false
	});

export default Board;