import * as forms from '../service/forms'
import httpStatus from 'http-status'
import logger from '../../config/loggerconfig'

export const getFieldsFixed = async (req, res) => {
  try {
    const dbResult = await forms.getFieldsFixed()
    logger.info('getFixedFields successful', dbResult.toString())
    res.status(httpStatus.OK).send(dbResult)
  } catch (err) {
    logger.error('Error in req getFixedFields', err.toString())
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Something went wrong')
  }
}

export const createFormSubmission = async (req, res) => {
    try {
        const token =(req.headers.authorization && req.headers.authorization.split(" ")[1]) || "";
        const resp = await forms.createFormSubmission(token, req.body);
        res.status(httpStatus.OK).send(resp);
    } catch (err) {
        logger.error('Error in req createFormSubmission', err)
        res.status(httpStatus.BAD_REQUEST).send('something went wrong')
    }
}

export const getFormSubmissions = async (req, res) => {
    try {
      const token =(req.headers.authorization && req.headers.authorization.split(" ")[1]) || "";
      const dbResult = await forms.getFormSubmissions(token, req.query)
      logger.info('getFormSubmissions successful', dbResult.toString())
      res.status(httpStatus.OK).send(dbResult)
    } catch (err) {
      logger.error('Error in req getFormSubmissions', err.toString())
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Something went wrong')
    }
  }
  