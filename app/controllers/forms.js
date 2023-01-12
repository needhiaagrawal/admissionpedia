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
