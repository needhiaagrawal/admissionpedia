import express from 'express'
import * as forms from '../app/controllers/forms'
import { auth } from "../middleware/auth";
import { schoolAuth } from "../middleware/schoolAuth";

export const formsRouter = express.Router()

formsRouter.get('/fieldsFixed', auth, forms.getFieldsFixed)
formsRouter.post('/submissions/add', auth, forms.createFormSubmission)
formsRouter.get('/submissions', auth, forms.getFormSubmissions)
formsRouter.get('/user/submissions', auth, forms.getSubmissionsByUser)
export default formsRouter
