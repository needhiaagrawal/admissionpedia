import { getSchoolService, getSchoolDetailService, getSchoolSearchFiltersService } from '../service/school';
import { STANDARD_SEARCH_LIMIT } from '../helper/constant';
import httpStatus from 'http-status';
import logger from '../../config/loggerconfig';

export const getSchools = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const board = req.query.board || null;
        const gender = req.query.gender || null;
        const admissionStatus = req.query.admissionStatus || null; // need to discuss 
        const district = req.query.district || null;
        const residencyType = req.query.residencyType || null;
        const classFilter = req.query.class || null;

        const limit = STANDARD_SEARCH_LIMIT;
        const dbResult = await getSchoolService(keyword, board, gender, district, residencyType, classFilter, admissionStatus, limit);
        logger.info('Get Schools successful' + dbResult.toString());

        res.send(dbResult);
    } catch (err) {
        logger.error('Error in req getSchools' + err.toString());
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Something went wrong')
    }
};

export const getSchoolDetails = async (req, res) => {
    try {
        const schoolId = req.params.schoolId;

        if (!schoolId) {
            res.status(httpStatus.BAD_REQUEST).send('School Id is not passed')
        }

        const dbResult = await getSchoolDetailService(schoolId);
        logger.info('Get School Detail successful' + JSON.stringify(dbResult));

        res.send(dbResult);
    } catch (err) {
        logger.error('Error in req getSchools' + err.toString());
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Something went wrong')
    }
}   


export const getSearchFilter = async (req, res) => {
    try {
        const dbResult = await getSchoolSearchFiltersService();
        logger.info('Get School Search Result successful'+ JSON.stringify(dbResult));
        res.send(dbResult);
    } catch (err) {
        logger.error('Error in req getSchools' + err.toString());
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Something went wrong')
    }
}