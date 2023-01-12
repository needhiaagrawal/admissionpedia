import express from 'express'
import * as forms from '../app/controllers/forms'
export const formsRouter = express.Router()

formsRouter.get('/fieldsFixed', forms.getFieldsFixed)
formsRouter.post('/submissions/add', forms.createFormSubmission)
formsRouter.get('/submissions', forms.getFormSubmissions)

export default formsRouter
