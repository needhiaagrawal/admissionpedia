import { DataTypes } from 'sequelize';
import sequelize from '../../config/db';

const APFormsSubmissionsValues = sequelize.define('APFormsSubmissionsValues', {
	id: {
		type: DataTypes.SMALLINT(6),
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	submission_id: {
		type: DataTypes.SMALLINT(6),
		allowNull: false
	},
	field_id: {
		type: DataTypes.SMALLINT(6),
		allowNull: false
	},
	field_value: {
		type: DataTypes.TEXT,
		allowNull: false
	},
	
},
{
    indexes: [
        {
            unique: true,
            fields: ['submission_id', 'field_id', 'field_value']
        }
    ]
},
	{
		tableName: 'ap_forms_submissions_values',
		timestamps: false
	}
);

export default APFormsSubmissionsValues;