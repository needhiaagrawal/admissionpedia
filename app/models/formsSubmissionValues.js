import { DataTypes } from 'sequelize';
import Submission from './formsSubmissions';
import sequelize from '../../config/db';
import APFieldsFixed from './fieldsFixed';

const APFormsSubmissionsValues = sequelize.define('APFormsSubmissionsValues', {
	id: {
		type: DataTypes.SMALLINT(6),
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	submission_id: {
		type: DataTypes.STRING(12),
		allowNull: false,
		references: {
			model: Submission,
			key: 'id'
		}
	},
	field_id: {
		type: DataTypes.SMALLINT(6),
		allowNull: false,
		references: {
			model: APFieldsFixed,
			key: 'id'
		}
	},
	field_value: {
		type: DataTypes.TEXT,
		allowNull: false
	},
	
},
{
	tableName: 'ap_forms_submissions_values',
	timestamps: false
},
{
    indexes: [
        {
            unique: true,
            fields: ['submission_id', 'field_id', 'field_value']
        }
    ]
}
);

APFormsSubmissionsValues.belongsTo(Submission, { as: 'submission', foreignKey: 'submission_id' });
APFormsSubmissionsValues.belongsTo(APFieldsFixed, { as: 'fieldName', foreignKey: 'field_id' });

export default APFormsSubmissionsValues;