import express from 'express'
import * as forms from '../app/controllers/forms'
export const formsRouter = express.Router()

formsRouter.get('/fieldsFixed', forms.getFieldsFixed)

export default formsRouter
