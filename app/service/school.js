
import { School, APClass, Board, District } from '../models/index';

import SchoolFacility from "../models/schoolFacility";
import Facilities from "../models/facilities";
import State from "../models/state";
import Country from '../models/country';

import { Op } from "sequelize";
import { getBoardList } from './board';
import { getClassesList } from './class';
import { APPLICATION_STATUS, GENDERS, DAY_BOARDING } from '../helper/constant';

export const getDetailedSchoolData = async (school) => {
  const { classes, class: detailedClasses, ...rest } = school;
  const newClasses = detailedClasses.map((classRow) => ({ id: classRow.id, name: classRow.name}));

  const facilities = await SchoolFacility.findAll({
    where: { 'school_id': school.id },
    include: [{
      model: Facilities,
      as: 'facilities_available',
      raw: false
    }]
  });

  const locationDetails = await District.findOne({
    where:  { id:  school.location.district_id },
    include: [{
      model: State,
      as: 'state',
      include: { model: Country, as: 'country'},
      raw: false
    }]
  })

  const districtData = locationDetails.toJSON();
  return {
    ...rest,
    board: school.board.name,
    classes: newClasses,
    status: school.status === 1 ? 'active' : 'archived',
    facilities,
    location: {
      ...school.location,
      "district_name": districtData.name,
      "state_id": districtData["state_id"],
      "state_name": districtData.state.name,
      "country_id": districtData.state["country_id"],
      "country_name": districtData.state.country.name,
      "iso_code": districtData.state.country["iso_code"]
    }
  };
}

export const getSchoolService = async (searchTerm, board, gender, district, residencyType, classFilter, admissionStatus, limit) => {

  let query = {
    name: {
      [Op.startsWith]: '%' + searchTerm + '%'
    }
  }; 


  if (board) {

    query = {
      board_id: board,
      ...query,
    }
  }

  if (gender) {
    query = {
      gender_accepted: gender,
      ...query,
    }
  }

  if (district) {
    query = {
      "location.district_id": district,
      ...query,
    }
  }

  if (residencyType) {
    query = {
      residency_type: residencyType,
      ...query,
    }
  }

  if(admissionStatus && parseInt(admissionStatus) === 0 || parseInt(admissionStatus) === 1) {
    query = {
      admission_status: parseInt(admissionStatus),
      ...query,
    }
  }


  const classQuery = classFilter ? {
    where: {
      id: classFilter
    },
  } : {}

  let rows = await School.findAll({
    attributes: ['name', 'address', 'gender_accepted', 'classes', 'residency_type', 'id', 'location', 'admission_status'],
    where: query,
    include: [{
      model: Board,
      attributes: ['name'],
      as: 'board',
      raw: false
    }, {
      model: APClass,
      attributes: ['name', 'id'],
      ...classQuery,
      as: 'class',
      raw: false
    }
    ],
    limit
  })


  rows = await Promise.all(rows.map(async (data, index) => {
    const row = data.toJSON();
    const formattedSchoolData = await getDetailedSchoolData(row);
    return formattedSchoolData;

  }))
  return rows;
}

export const getSchoolDetailService = async (schoolId) => {
  let row = await School.findOne({
    where: {
      id: schoolId
    },
    include: [{
      model: Board,
      attributes: ['name'],
      as: 'board',
      raw: false
    }, {
      model: APClass,
      attributes: ['name', 'id'],
      as: 'class',
      raw: false
    }
    ],
  })

  const formattedSchoolData = await getDetailedSchoolData(row.toJSON());
  return formattedSchoolData;
}

export const getSchoolSearchFiltersService = async () => {
  const result = {}
  result.boards = await getBoardList();
  result.classes = await getClassesList();
  result.facilities = await Facilities.findAll({ where: { show_in_filter: true }})
  result.applicationStatuses = APPLICATION_STATUS;
  result.genders = GENDERS;
  result.dayBoarding = DAY_BOARDING;
  return result;
}