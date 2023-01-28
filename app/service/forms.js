import FieldsFixed from "../models/fieldsFixed";
import FormsSubmissions from "../models/formsSubmissions";
import FormsSubmissionValues from "../models/formsSubmissionValues";
import { getDecodedToken } from "../../utils/user";
import _ from 'lodash';
import { isEmail } from '../../utils/helper';
import  phpUnserialize from 'phpunserialize';
import { uid } from 'uid';
import moment from "moment";
import logger from "../../config/loggerconfig";

const getDecodedFieldConstraints = (str) => {
  var result = phpUnserialize(str);

  if (result.set && result.set.length) {
    result.set = result.set.split('\r\n');
  }
  return result
}

export const getFieldsFixed = async () => {
  let list = await FieldsFixed.findAll({ raw: false });

  if(list && list.length) {
    list = list.map((row) => {
      const { field_code, field_constraints, ...rest } = row.toJSON()

      return {
        ...rest,
        field_constraints,
        field_constraints: getDecodedFieldConstraints(field_constraints)
      }
    });
  }
  return list;
};



export const validateFormSubmission = async (fixedFieldsList, submitFields) => {
  let errorMessage  = '';
  let isFormValid = true;
  await Promise.all((fixedFieldsList.map(async (fieldData) => {

    if (!isFormValid && errorMessage) return;

      const decodedConstraints = fieldData.field_constraints;

      const isFieldExists = submitFields.filter((userField) => userField.fieldId === fieldData.id);

      if (decodedConstraints && decodedConstraints.field_required) {
        if (!isFieldExists || !isFieldExists.length) {
          isFormValid = false
          errorMessage = `${fieldData.field_name} is required`;
          return;
        }
      } 

      const filledFieldData = isFieldExists[0];

      switch (fieldData['field_type']) {
        case 'string': {

          if (decodedConstraints) {
            if (typeof filledFieldData.fieldValue !== "string") {
              isFormValid = false
              errorMessage = `${fieldData.field_name} must be a string`;
              break;
            }

            if (decodedConstraints.min_length && filledFieldData.fieldValue.length < decodedConstraints.min_length) {
              isFormValid = false
              errorMessage = `${fieldData.field_name} must contain atleast ${decodedConstraints.min_length} characters`;
              break;
            }

            if (decodedConstraints.max_length && filledFieldData.fieldValue.length > decodedConstraints.max_length) {
              isFormValid = false
              errorMessage = `${fieldData.field_name} should not contain more than ${decodedConstraints.max_length} characters`;
              break;
            }
          }

          break;
        }

        case 'email': {
          if (decodedConstraints) {
            if (!isEmail(filledFieldData.fieldValue)) {
              isFormValid = false
              errorMessage = `${fieldData.field_name} is not a valid email`;
              break;
            }
          }

          break;
        }

        case 'number': {
          if (decodedConstraints) {
            
            if (typeof filledFieldData.fieldValue !== "number") {
              isFormValid = false
              errorMessage = `${fieldData.field_name} must be a number`;
              break;
            }

            if (decodedConstraints.min_length && filledFieldData.fieldValue.toString().length < decodedConstraints.min_length) {
              isFormValid = false
              errorMessage = `${fieldData.field_name} must contain atleast ${decodedConstraints.min_length} digit`;
              break;
            }

            if (decodedConstraints.max_length && filledFieldData.fieldValue.toString().length > decodedConstraints.max_length) {
              isFormValid = false
              errorMessage = `${fieldData.field_name} should not contain more than ${decodedConstraints.max_length} digit`;
              break;
            }
            
            if (decodedConstraints.max_value && filledFieldData.fieldValue > decodedConstraints.max_value) {
              isFormValid = false
              errorMessage = `${fieldData.field_name} should be equal to or less than ${decodedConstraints.max_value}`;
              break;
            }

            if (decodedConstraints.min_Value && filledFieldData.fieldValue < decodedConstraints.min_Value) {
              isFormValid = false
              errorMessage = `${fieldData.field_name} should be equal to or grater than ${decodedConstraints.min_value}`;
              break;
            }


          }
          break;
        }

        case 'set': {
          if (decodedConstraints) {
            if (decodedConstraints.set?.length && !decodedConstraints.set.includes(filledFieldData.fieldValue)) {
              isFormValid = false
              errorMessage = `${fieldData.field_name} is not valid`;
              break;
            }
          }
          break;
        }

        case 'date': {
          if (decodedConstraints) {
            if (!moment(filledFieldData.fieldValue, 'DD-MM-YYYY', true).isValid()) {
              isFormValid = false
              errorMessage = `${fieldData.field_name} is not valid`;
              break;
            }

            if (decodedConstraints.min_value && moment(filledFieldData.fieldValue, 'DD-MM-YYYY', true).isAfter(moment(decodedConstraints.min_Value, 'DD-MM-YYYY', true))) {
              isFormValid = false
              errorMessage = `${fieldData.field_name} is not valid`;
              break;
            } 

            if (decodedConstraints.max_value && moment(filledFieldData.fieldValue, 'DD-MM-YYYY', true).isBefore(moment(decodedConstraints.max_value, 'DD-MM-YYYY', true))) {
              isFormValid = false
              errorMessage = `${fieldData.field_name} is not valid`;
              break;
            } 

          }
          break;
        }
      }

      return;
      
  })))

  return {
    isFormValid,
    errorMessage
  }
}

export const createFormSubmission = async (token, dataFields) => {
  let userDataFromToken = getDecodedToken(token);
  const { schoolId, classId, fields } = dataFields;
  const submissionId = uid(12); 
  const fixedFieldsList = await getFieldsFixed();


  const { isFormValid, errorMessage } = await validateFormSubmission(fixedFieldsList, fields);
  
  if (!isFormValid && errorMessage) {
    return {
      success: false,
      message: errorMessage
    }
  } 

  try {

    await FormsSubmissions.create({
      id: submissionId,
      user_id: userDataFromToken.userId,
      school_id: schoolId,
      class_id: classId,
      status: dataFields.status ? dataFields.status : 0,
      payment_status: dataFields.paymentStatus ? dataFields.paymentStatus : 0,
      created: moment().format(),
    });
    if (submissionId && fields) {
  
      await Promise.all((fields.map(async (row) => {
        await FormsSubmissionValues.create({
          submission_id: submissionId,
          field_id: row.fieldId,
          field_value: row.fieldValue,
        });
  
        return;
      })))
    }

    return {
      success: true,
      message: 'Form is created Successfully'
    }



  } catch (err) {
    logger.info(`Something went wrong in Form Creation ${err.toString()}`)
    return {
      success: false,
      message: 'Something went wrong in Form Creation'
    }
  }

};

export const getFormSubmissions = async (token, dataFields) => {
  let userDataFromToken = getDecodedToken(token);
  const { schoolId, classId } = dataFields;
  let submissions = await FormsSubmissions.findAll({
    where: {
      school_id: schoolId,
      class_id: classId,
      user_id: userDataFromToken.userId,
    },
    raw: true,
  });
  for (let i = 0; i < submissions.length; i += 1) {
    let fieldValues = await FormsSubmissionValues.findAll({
      where: { submission_id: submissions[i].id },
      include: 
        {
          model: FieldsFixed,
          attributes: [
            'field_name',
          ],
          as: 'fieldName',
          raw: false
        }
    });

    fieldValues = fieldValues.map((row) => {
      const fieldData = row.toJSON();
      return { ...fieldData, fieldName: fieldData.fieldName?.field_name }
    })
    if (fieldValues) {
      submissions[i]["values"] = _.groupBy(fieldValues, 'submission_id');
      
    }
  }
  return submissions;
};
