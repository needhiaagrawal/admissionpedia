import { DataTypes } from 'sequelize';
import sequelize from '../../config/db';
import State from './state';

const District = sequelize.define('district', {
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
	state_id: {
		type: DataTypes.STRING,
		allowNull: false
	},
},
	{
		tableName: 'ap_districts',
		timestamps: false
	});

District.belongsTo(State, { as: 'state', foreignKey: 'state_id' });

export default District;