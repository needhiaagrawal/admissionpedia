import express from 'express'
import * as classes from '../app/controllers/class'
import { validate } from '../middleware/validate'
import * as classValidator from '../validations/school'
export const classRouter = express.Router()
import { auth } from '../middleware/auth'

classRouter.post(
  '/admission/update',
  auth,
  validate(classValidator.admissionStatus),
  classes.updateAdmissionStatus
)

classRouter.get('/admission/:schoolId', auth, classes.getClassAdmissions)

export default classRouter
