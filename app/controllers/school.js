import { getSchoolService, getSchoolDetailService, getSchoolSearchFiltersService, schoolShortlistedService, shortlistedSchool, getSchoolsListService } from '../service/school';
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

export const schoolShortlisted = async (req, res) => {
    try {
        const token =(req.headers.authorization && req.headers.authorization.split(" ")[1]) || "";
        const schoolId = req.params.schoolId;
        const notification = req.query.notify || "no";
        if (!schoolId) {
            res.status(httpStatus.BAD_REQUEST).send('School Id is not passed')
        }
        const dbResult = await schoolShortlistedService(token, schoolId, notification);
        logger.info('School Shortlisted successful' + JSON.stringify(dbResult));
        res.status(httpStatus.OK).send("School shortlisted successfully");
    } catch (err) {
        logger.error('Error in req schoolShortlisted' + err.toString());
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Something went wrong')
    }
}   

export const getShortlistedSchool = async (req, res) => {
    try {
        const token =(req.headers.authorization && req.headers.authorization.split(" ")[1]) || "";
        const dbResult = await shortlistedSchool(token);
        logger.info('getShortlistedSchool successful' + JSON.stringify(dbResult));
        res.status(httpStatus.OK).send({
            success: true,
            data: dbResult
        });
    } catch (err) {
        logger.error('Error in req getShortlistedSchool' + err.toString());
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Something went wrong')
    }
}   

export const getSchoolsForAuthorizedUser = async (req, res) => {
    try {
        const token =(req.headers.authorization && req.headers.authorization.split(" ")[1]) || "";
        const limit = STANDARD_SEARCH_LIMIT;
        const dbResult = await getSchoolsListService(token, req.query, limit);
        res.status(httpStatus.OK).send(dbResult);
    } catch (err) {
        logger.error('Error in req getSchoolsForAuthorizedUser' + err.toString());
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Something went wrong')
    }
};
