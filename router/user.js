import express from 'express';
import { createUser, otpResend, otpValidate, login, forgetPassword, resetPassword, schoolLogin, changePassword } from '../app/controllers/user';
import { validate } from '../middleware/validate';
import * as userValidator from '../validations/user'
export const userRouter = express.Router();

userRouter.post('/registration', validate(userValidator.registration), createUser);
userRouter.get('/otpResend', validate(userValidator.otpResend), otpResend);
userRouter.get('/otpValidate', validate(userValidator.otpValidate), otpValidate);
userRouter.post('/login', validate(userValidator.login), login);
userRouter.post('/forgetPassword', validate(userValidator.forgetPassword), forgetPassword);
userRouter.post('/resetPassword',validate(userValidator.resetPassword), resetPassword);
userRouter.post('/changePassword',validate(userValidator.changePassword), changePassword);
userRouter.post('/school-login', validate(userValidator.login), schoolLogin);

export default userRouter;

                                                                                                                                                                                                           