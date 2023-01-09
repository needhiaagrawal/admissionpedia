import express from 'express';
import { getSchools, getSchoolDetails, getSearchFilter } from '../app/controllers/school';
import { validate } from '../middleware/validate';
import * as schoolValidator from '../validations/school'
export const schoolRouter = express.Router();

schoolRouter.get('/search-filters', getSearchFilter);
schoolRouter.get('/:schoolId', getSchoolDetails);
schoolRouter.get('/', validate(schoolValidator.getSchools), getSchools);

export default schoolRouter;
