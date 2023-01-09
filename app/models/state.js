import { DataTypes } from 'sequelize';
import sequelize from '../../config/db';
import Country from './country';
const State = sequelize.define('State', {
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
		tableName: 'ap_states',
		timestamps: false
	});

State.belongsTo(Country, { as: 'country', foreignKey: 'country_id' });
export default State;

