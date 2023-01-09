import express from 'express';
import { getSchoolLocations } from '../app/controllers/location';
import { validate } from '../middleware/validate';
import * as locationValidator from '../validations/location'
export const locationRouter = express.Router();

locationRouter.get('/', validate(locationValidator.getSchoolLocations), getSchoolLocations);

export default locationRouter;
