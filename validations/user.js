import Joi from 'joi';

export const registration = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        password: Joi.string().required().min(8).max(20).alphanum(),
        email: Joi.string().email().required(),
        mobile: Joi.string().length(10).required(),
        role: Joi.string().allow('parent', 'student').required()
    }),
};

export const otpResend = {
    query: Joi.object().keys({
        email: Joi.string().email().optional(),
        mobile: Joi.string().length(10).optional(),
        source: Joi.string().allow('email', 'phone').required()
    }),
};

export const otpValidate = {
    query: Joi.object().keys({
        email: Joi.string().email().optional(),
        mobile: Joi.string().length(10).optional(),
        source: Joi.string().allow('email', 'phone').required(),
        otp: Joi.string().length(6).required()
    }),
};  

export const login  = {
    body: Joi.object().keys({
        userName: Joi.alternatives().try(Joi.string().email(), Joi.string().length(10)).required(),
        password: Joi.string().required().min(8).max(20).alphanum()
    })
}

export const forgetPassword = {
    body:  Joi.object().keys({
        userName: Joi.alternatives().try(Joi.string().email(), Joi.string().length(10)).required(),
    })
}

export const resetPassword = {
    body: Joi.object().keys({
        userName: Joi.alternatives().try(Joi.string().email(), Joi.string().length(10)).required(),
        password: Joi.string().required().min(8).max(20).alphanum(),
        otp: Joi.string().length(6).required()
    })
}
export const changePassword = {
    body: Joi.object().keys({
        oldPassword: Joi.string().required().min(8).max(20).alphanum(),
        newPassword: Joi.string().required().min(8).max(20).alphanum()
    })
}