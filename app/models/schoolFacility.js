import { DataTypes } from 'sequelize';
import sequelize from '../../config/db';
import School from './school';
import Facilities from './facilities';

const SchoolFacility = sequelize.define('SchoolFacility', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	school_id: {
		type: DataTypes.STRING(15),
		allowNull: false,
        references: {
			model: School,
			key: 'id'
		}
	},
	facility_id: {
		type: DataTypes.SMALLINT(11),
		allowNull: false,
        references: {
			model: Facilities,
			key: 'id'
		}
	},
    value: {
        type: DataTypes.STRING,
    }
},
	{
		tableName: 'ap_school_facilities_relation',
		timestamps: false
	});

export default SchoolFacility;

SchoolFacility.belongsTo(School, { as: 'school', foreignKey: 'school_id' }); 
SchoolFacility.belongsTo(Facilities,  { as: 'facilities_available', foreignKey: 'facility_id' } )
