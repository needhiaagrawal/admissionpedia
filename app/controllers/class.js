import * as classService from '../service/class';
import httpStatus from 'http-status';
import logger from '../../config/loggerconfig';

export const updateAdmissionStatus = async (req, res) => {
    try {
        const token =(req.headers.authorization && req.headers.authorization.split(" ")[1]) || "";
        const schoolId = req.body.schoolId;
        if (!schoolId) {
            res.status(httpStatus.BAD_REQUEST).send('School Id is not passed')
        }
        await classService.updateAdmissionStatus(token, req.body);
        logger.info('Admission Status updated successful');
        res.status(httpStatus.OK).send("Admission Status updated successfully");
    } catch (err) {
        logger.error('Error in req update Admission Status' + err.toString());
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Something went wrong')
    }
}   
export const getClassAdmissions = async (req, res) => {
    try {
        const token =(req.headers.authorization && req.headers.authorization.split(" ")[1]) || "";
        const schoolId = req.params.schoolId;
        if (!schoolId) {
            res.status(httpStatus.BAD_REQUEST).send('School Id is not passed')
        }
        let admissions = await classService.getClassAdmissions(token, schoolId);
        logger.info('Admission Status get successful');
        res.status(httpStatus.OK).send(admissions);
    } catch (err) {
        logger.error('Error in req get Admission Status' + err.toString());
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Something went wrong')
    }
}   