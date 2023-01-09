import { getSchoolLocationsService } from '../service/location';
import { STANDARD_SEARCH_LIMIT } from '../helper/constant';
import httpStatus from 'http-status';
import logger from '../../config/loggerconfig';

export const getSchoolLocations = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const limit = STANDARD_SEARCH_LIMIT;
        const dbResult = await getSchoolLocationsService(keyword, limit);
        logger.info('getDistricts successful', dbResult.toString());

        res.send(dbResult);
    } catch (err) {
        logger.error('Error in req getDistricts', err.toString());
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Something went wrong')
    }
};