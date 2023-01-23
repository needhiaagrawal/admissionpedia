import * as classService from '../service/class';
import httpStatus from 'http-status';
import logger from '../../config/loggerconfig';

export const updateAdmissionStatus = async (req, res) => {
    try {
        const token =(req.headers.authorization && req.headers.authorization.split(" ")[1]) || "";
        await classService.updateAdmissionStatus(token, req.body);
        logger.info('Admission Status updated successful');
        res.status(httpStatus.OK).send({ success: true, message:"Admission Status updated successfully"});
    } catch (err) {
        logger.error('Error in req update Admission Status' + err.toString());
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ success: false, message:'Something went wrong'})
    }
}   
export const getClassAdmissions = async (req, res) => {
    try {
        const token =(req.headers.authorization && req.headers.authorization.split(" ")[1]) || "";
        const schoolId = req.params.schoolId;
        let admissions = await classService.getClassAdmissions(token, schoolId);
        logger.info('Admission Status get successful');
        res.status(httpStatus.OK).send({ success: true, message: "", data: admissions});
    } catch (err) {
        logger.error('Error in req get Admission Status' + err.toString());
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ success: false, message:'Something went wrong'})
    }
}   