import { DataTypes } from 'sequelize';
import sequelize from '../../config/db';
import Board from './board';

const SchoolTemp = sequelize.define('school', {
	id: {
		type: DataTypes.STRING,
		allowNull: false,
		primaryKey: true
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	affiliation_no: {
		type: DataTypes.STRING,
		allowNull: false
	},
	board_id: {
		type: DataTypes.SMALLINT(6),
		allowNull: false,
		references: {
			model: Board,
			key: 'id'
		  }
	},
	head: {
		type: DataTypes.STRING,
	},
	gender_accepted: {
		type: DataTypes.ENUM('Co-ed', 'Female', 'Male'),
	},
	residency_type: {
		type: DataTypes.ENUM('Day And Boarding', 'Day', 'Boarding'),
	},
	medium: {
		type: DataTypes.STRING(100)
	},
	classes: {
		type: DataTypes.JSON,
		allowNull: false,
	},
	address: {
		type: DataTypes.STRING,
		allowNull: false
	},
	pincode: {
		type: DataTypes.STRING(10),
		allowNull: false
	},
	location: {
		type: DataTypes.JSON
	},
	geolocation: {
		type: DataTypes.GEOMETRY('POINT')
	},
	phone: {
		type: DataTypes.STRING(10),
	},
	email: {
		type: DataTypes.STRING,
	},
	website: {
		type: DataTypes.STRING,
	},
	established: {
		type: DataTypes.STRING(4),
	},
	about: {
		type: DataTypes.TEXT,
	},
	admission_process: {
		type: DataTypes.JSON,
	},
	achievements: {
		type: DataTypes.TEXT,
	},
	status: {
		type: DataTypes.TINYINT(4),
	},
	admission_status: {
		type: DataTypes.INTEGER(4),
	},
	created: {
		type: DataTypes.DATE,
	},
	updated: {
		type: DataTypes.DATE,
	},
},
	{
		tableName: 'ap_schools_temp',
		timestamps: false
	});


export default SchoolTemp;

