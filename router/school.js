import express from 'express';
import * as school from '../app/controllers/school';
import { validate } from '../middleware/validate';
import * as schoolValidator from '../validations/school'
export const schoolRouter = express.Router();
import { auth } from "../middleware/auth";


schoolRouter.get('/findSchool', validate(schoolValidator.findSchool), school.findSchoolByRegistrationNumber)
schoolRouter.post('/selfSignupSchool', validate(schoolValidator.schoolSelfSignup), school.selfSignupSchool)

schoolRouter.get('/list', auth, validate(schoolValidator.getSchoolsList), school.getSchoolsForAuthorizedUser);
schoolRouter.get('/shortlisted/:schoolId', auth, validate(schoolValidator.schoolShorlisted), school.schoolShortlisted);
schoolRouter.get('/shortlisted', auth, school.getShortlistedSchool);
schoolRouter.get('/search-filters', school.getSearchFilter);
schoolRouter.get('/:schoolId', school.getSchoolDetails);
schoolRouter.get('/', validate(schoolValidator.getSchools), school.getSchools);
export default schoolRouter;