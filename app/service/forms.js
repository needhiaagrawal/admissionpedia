import fieldsFixed from '../models/fieldsFixed'
import formsSubmissions from '../models/formsSubmissions'
import formsSubmissionValues from '../models/formsSubmissionValues'
import { getDecodedToken } from '../../utils/user'
import moment from 'moment'

export const getFieldsFixed = async () => {
  let list = await fieldsFixed.findAll({ raw: false })
  return list
}

export const createFormSubmission = async (token, dataFields) => {
    let userDataFromToken = getDecodedToken(token)
    const { schoolId, classId, fields } = dataFields
    const submissionId = Math.random().toString(36).slice(2)
    await formsSubmissions.create({
        id: submissionId,
        user_id: userDataFromToken.userId,
        school_id: schoolId,
        class_id: classId,
        status: dataFields.status ? dataFields.status : 0,
        payment_status: dataFields.paymentStatus ? dataFields.paymentStatus : 0,
        created: moment().format()
      })
      if(submissionId && fields){
        for (let i = 0; i < fields.length; i += 1) {
            let row = fields[i]
            await formsSubmissionValues.create({
                submission_id: submissionId,
                field_id: row.fieldId,
                field_value: row.fieldValue
            });
        }
        if(submissionId){
            return "Form submitted successfully"
        }
      }
      throw Error('Something went wrong');
}

export const getFormSubmissions = async (token, dataFields) => {
  let userDataFromToken = getDecodedToken(token)
  const { schoolId, classId } = dataFields
  let submissions = await formsSubmissions.findAll({
    where: {
      school_id: schoolId,
      class_id: classId,
      user_id: userDataFromToken.userId
    },
    raw: true
  })
  for (let i = 0; i < submissions.length; i += 1) {
    let fieldValues = await formsSubmissionValues.findAll({
      where: { submission_id: submissions[i].id }
    })
    if (fieldValues) {
      submissions[i]['values'] = fieldValues
    }
  }
  return submissions
}
