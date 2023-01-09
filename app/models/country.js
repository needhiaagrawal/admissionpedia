import { DataTypes } from 'sequelize';
import sequelize from '../../config/db';

const Country = sequelize.define('Country', {
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
	is_default: {
		type: DataTypes.TINYINT,
		allowNull: false
	},
    iso_code: {
		type: DataTypes.STRING(2),
		allowNull: false
	},
},
	{
		tableName: 'ap_countries',
		timestamps: false
	});

export default Country;