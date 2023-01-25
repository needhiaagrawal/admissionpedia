
import { School, APClass, Board, District } from '../models/index';

import SchoolFacility from "../models/schoolFacility";
import ShortlistedSchools from "../models/shortlistedSchools";
import Facilities from "../models/facilities";
import State from "../models/state";
import Country from '../models/country';
import ClassAdmission from '../models/schoolClassAdmission'
import { Op } from "sequelize";
import { getBoardList } from './board';
import { getClassesList } from './class';
import { APPLICATION_STATUS, GENDERS, DAY_BOARDING } from '../helper/constant';
import { getDecodedToken } from '../../utils/user';
import moment from 'moment';

export const getDetailedSchoolData = async (school, shortlisted=0) => {
  const { classes, class: detailedClasses, ...rest } = school;

  const admissionDetails  = await ClassAdmission.findAll({
    attributes: ['start_date','end_date', 'class_id', 'status', 'fee'],
    where: { school_id: school.id },
    include: [
      {
        model: APClass,
        attributes: ['name'],
        as: 'className',
        raw: false
      }
    ]
  })

  const newClasses = detailedClasses.map((classRow) => {
    const classAdmissionRowCheck = admissionDetails.filter((ele) => ele['class_id'] === classRow.id);
    let start_date = null, end_date = null, admission_status = 0, fees = 0;
    if (classAdmissionRowCheck.length) {
        start_date = classAdmissionRowCheck[0]['start_date'];
        end_date = classAdmissionRowCheck[0]['end_date'];
        admission_status = classAdmissionRowCheck[0]['status'];
        fees = classAdmissionRowCheck[0]['fee'];
    }
    return { id: classRow.id, name: classRow.name, start_date, end_date, fees, admission_status }
  });

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


 
  let isShortlisted = "no"

  if(shortlisted == 1){
    const shortlisted = await ShortlistedSchools.findOne({
      where: { 'school_id': school.id }
    });
    if(shortlisted){
      isShortlisted = "yes"
    }
    school.shortlisted = isShortlisted;
  }

  const districtData = locationDetails.toJSON();
  return {
    ...rest,
    board: school.board.name,
    classes: newClasses,
    status: school.status == 1 ? 'active' : 'archived',
    admission_status: school.admission_status == 1 ? 'active' : 'archived',
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

  if(admissionStatus && parseInt(admissionStatus) === 1) {
    query = {
      admission_status: parseInt(admissionStatus) ,
      ...query,
    }
  } else if(admissionStatus && parseInt(admissionStatus) === 0) {
    query = {
      admission_status: {
        [Op.or]: [0, null] 
      } ,
      ...query,
    }

  }
  
  const classQuery = classFilter ? {
    where: {
      id: classFilter
    },
  } : {}

  let rows = await School.findAll({
    attributes: ['name', 'address', 'gender_accepted', 'classes', 'residency_type', 'id', 'location', 'admission_status', 'status'],
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
    if(data){
      const row = data.toJSON();
      const formattedSchoolData = await getDetailedSchoolData(row);
      return formattedSchoolData;
    }
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

export const schoolShortlistedService = async (
  token,
  schoolId,
  notification
) => {
  let userDataFromToken = getDecodedToken(token)
  let alreadyShortlisted = await ShortlistedSchools.findOne({
    where: { school_id: schoolId, user_id: userDataFromToken.userId }
  })
  if (!alreadyShortlisted) {
    const newShortlist = await ShortlistedSchools.create({
      user_id: userDataFromToken.userId,
      school_id: schoolId,
      notification_flag: notification && notification == 'yes' ? 1 : 0,
      created: moment().format(),
      updated: moment().format()
    })
    const shortlistId = newShortlist.toJSON().id
    return shortlistId
  } else {
    await ShortlistedSchools.update(
      {
        notification_flag: notification && notification == 'yes' ? 1 : 0,
        updated: moment().format()
      },
      {
        where: {
          user_id: userDataFromToken.userId,
          school_id: schoolId
        }
      }
    )
    return alreadyShortlisted.dataValues.id
  }
}

export const shortlistedSchool = async token => {
  let userDataFromToken = getDecodedToken(token)
  let rows = await ShortlistedSchools.findAll({
    attributes: ['id', 'school_id', 'notification_flag'],
    where: {
      user_id: userDataFromToken.userId
    },
    include: [
      {
        model: School,
        attributes: [
          'name',
          'address',
          'gender_accepted',
          'residency_type',
          'admission_status'
        ],
        as: 'school',
        raw: false
      }
    ]
  })

  if (rows) {
    const newRows  = await Promise.all(rows.map((row) => {
      const data = row.toJSON();
      const { school } = data;
      return {
        shortlisted: data.notification_flag,
        id: data.id,
        ...school
      }
    }))

    return newRows;

  }
  return rows
}

export const getSchoolsListService = async (token, fieldsData, limit) => {
  let userDataFromToken = getDecodedToken(token);

  const searchTerm = fieldsData.keyword;
  const board = fieldsData.board || null;
  const gender = fieldsData.gender || null;
  const admissionStatus = fieldsData.admissionStatus || null; // need to discuss 
  const district = fieldsData.district || null;
  const residencyType = fieldsData.residencyType || null;
  const classFilter = fieldsData.class || null;
  const shortlistedFilter = fieldsData.shortlistedOnly || null;
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
  
  let shortlistQuery =  {}

  if (shortlistedFilter)  {
    const shortlistedSchoolsList = await shortlistedSchool(token);
    shortlistQuery  = {
      id: {
        [Op.in]: shortlistedSchoolsList.map((row) => row.school_id).filter((row) => row)
      }
    }


    query = {
      ...shortlistQuery,
      ...query
    }
  }


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
    if(data){
      const row = data.toJSON();
      const formattedSchoolData = await getDetailedSchoolData(row, 1);
      return formattedSchoolData;
    }
  }))
  return rows;
}