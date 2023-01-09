import School from "./school";
import Class from './classes';
import SchoolClass from "./schoolClass";
import Board from './board';
import District from './district';

School.belongsTo(Board, { as: 'board', foreignKey: 'board_id' });

School.belongsToMany(Class, {
	through: {
	  model: SchoolClass,
	},
	foreignKey: 'school_id',
	as: 'class'
  });

Class.belongsToMany(School, {
	through: {
	  model: SchoolClass,
	},
	foreignKey: 'class_id',
	as: 'schools'
  });

// School.belongsTo(District, { as: 'district', foreignKey: 'location->$.district_id' });

export { 
    School,
    SchoolClass,
    Class as APClass,
    Board,
	District
}