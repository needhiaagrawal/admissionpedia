import express from 'express';
import * as school from '../app/controllers/school';
import { validate } from '../middleware/validate';
import * as schoolValidator from '../validations/school'
export const schoolRouter = express.Router();

schoolRouter.get('/search-filters', school.getSearchFilter);
schoolRouter.get('/:schoolId', school.getSchoolDetails);
schoolRouter.get('/', validate(schoolValidator.getSchools), school.getSchools);
schoolRouter.get('/shortlisted/:schoolId', validate(schoolValidator.schoolShorlisted), school.schoolShortlisted);
export default schoolRouter;
