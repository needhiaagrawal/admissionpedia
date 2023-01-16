import Classes from '../models/classes'
import ClassAdmission from '../models/schoolClassAdmission'
import SchoolClass from '../models/schoolClass'
import { getDecodedToken } from '../../utils/user'
import moment from 'moment'

export const getClassesList = async () => {
  let classesList = await Classes.findAll({ raw: false })
  return classesList
}

export const updateAdmissionStatus = async (token, dataFields) => {
  const { schoolId, startDate, endDate, classIds } = dataFields
  let classIdsArr = classIds
  if (classIds.length === 0) {
    // fetch all class Ids for school
    let rows = await SchoolClass.findAll({
      attributes: ['class_id'],
      where: { school_id: schoolId }
    })
    rows = await Promise.all(
      rows.map(async (data, index) => {
        const row = data.toJSON()
        classIdsArr.push(row.class_id)
      })
    )
  }
  for await (const classId of classIdsArr) {
    let entryExists = await ClassAdmission.findOne({
      where: { school_id: schoolId, class_id: classId }
    })
    if (entryExists) {
      await ClassAdmission.update(
        {
          status: 1,
          start_date: startDate,
          end_date: endDate,
          updated: moment().format()
        },
        {
          where: {
            school_id: schoolId,
            class_id: classId
          }
        }
      )
    } else {
      await ClassAdmission.create({
        school_id: schoolId,
        class_id: classId,
        status: 1,
        fee: 0, //need to update after
        start_date: startDate,
        end_date: endDate,
        created: moment().format(),
        updated: moment().format()
      })
    }
  }
}

export const getClassAdmissions = async (token, schoolId) => {
  let admissionArr = []
  let rows = await ClassAdmission.findAll({
    where: { school_id: schoolId },
    include: [
      {
        model: Classes,
        attributes: ['name'],
        as: 'className',
        raw: true
      }
    ]
  })
  rows = await Promise.all(
    rows.map(async (data, index) => {
      const row = data.toJSON()
      admissionArr.push(row)
    })
  )
  return admissionArr
}
