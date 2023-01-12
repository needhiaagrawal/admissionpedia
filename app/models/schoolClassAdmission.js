import { DataTypes } from 'sequelize';
import sequelize from '../../config/db';
import School from './school';
import Class from './classes';

const SchoolClassAdmission = sequelize.define('SchoolClassAdmission', {
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
    start_date: {
		type: DataTypes.DATE,
        allowNull: false,
	},
	end_date: {
		type: DataTypes.DATE,
        allowNull: false,
	},
    fee: {
        type: DataTypes.INTEGER(11),
        default: 0
    },
    status: {
		type: DataTypes.TINYINT(4),
        allowNull: false,
	},
	created: {
		type: DataTypes.DATE,
        allowNull: false,
	},
	updated: {
		type: DataTypes.DATE,
        allowNull: false,
		defaultValue: sequelize.literal('NOW ON UPDATE NOW'),
	},
},
	{
		tableName: 'ap_schools_classes_admission',
		timestamps: false
	});

export default SchoolClassAdmission;

SchoolClassAdmission.belongsTo(School, { as: 'school', foreignKey: 'school_id' }); 
SchoolClassAdmission.belongsTo(Class,  { as: 'className', foreignKey: 'class_id' } )
