import express from 'express';
import * as school from '../app/controllers/school';
import { validate } from '../middleware/validate';
import * as schoolValidator from '../validations/school'
export const schoolRouter = express.Router();
import { auth } from "../middleware/auth";

schoolRouter.get('/shortlisted/:schoolId', auth, validate(schoolValidator.schoolShorlisted), school.schoolShortlisted);

schoolRouter.get('/search-filters', school.getSearchFilter);
schoolRouter.get('/:schoolId', school.getSchoolDetails);
schoolRouter.get('/', validate(schoolValidator.getSchools), school.getSchools);

export default schoolRouter;