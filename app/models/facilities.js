import { DataTypes } from 'sequelize';
import sequelize from '../../config/db';

const Facilities = sequelize.define('Facility', {
    id: {
		type: DataTypes.SMALLINT(11),
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	type: {
		type: DataTypes.ENUM('Boolean', 'Text', 'Number'),
		allowNull: false
	},
	show_in_filter: {
		type: DataTypes.TINYINT,
		allowNull: false
	}
}, {
	tableName: 'ap_facilities',
	timestamps: false
});

export default Facilities;