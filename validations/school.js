import Joi from 'joi';

export const getSchools = {
    query: Joi.object().keys({
        keyword: Joi.string().required(),
        board: Joi.number().optional(),
        gender: Joi.string().equal('Male', 'Female', 'Co-ed').optional(),
        admissionStatus:  Joi.alternatives().try(Joi.string().allow(null), Joi.number()).optional(),
        district: Joi.number().optional(),
        class:  Joi.number().optional(),
        residencyType: Joi.string().equal('Day And Boarding', 'Day', 'Boarding').optional(),
    }),
};  

export const findSchool = {
    query: Joi.object().keys({
        registrationNumber: Joi.string().required(),
        board: Joi.number().required(),
    }),
};  


export const getSchoolsList = {
    query: Joi.object().keys({
        keyword: Joi.string().required(),
        board: Joi.number().optional(),
        gender: Joi.string().equal('Male', 'Female', 'Co-ed').optional(),
        admissionStatus:  Joi.alternatives().try(Joi.string().allow(null), Joi.number()).optional(),
        district: Joi.number().optional(),
        class:  Joi.number().optional(),
        residencyType: Joi.string().equal('Day And Boarding', 'Day', 'Boarding').optional(),
        shortlistedOnly: Joi.boolean().optional()
    }),
};  

export const schoolShorlisted = {
    query: Joi.object().keys({
        notify: Joi.string().allow('yes', 'no').optional(),
    }),
};  


export const schoolSelfSignup = {
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(20),
        schoolName: Joi.string().required().min(2).max(100),
        email: Joi.string().email().required(),
        address: Joi.string().required().min(2).max(100),
        city: Joi.string().required().min(2).max(30),
        state: Joi.string().required().min(2).max(30),
        pincode: Joi.string().required().length(6),
        board: Joi.number().required(),
        gender: Joi.string().equal('Male', 'Female', 'Co-ed').required(),
        classes:  Joi.array().required().min(1),
        registrationNumber: Joi.string().required(),
        phoneNumber: Joi.string().length(10).required(),
    }),
};  


export const selfSignupSchoolAdmin = {
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(20),
        email: Joi.string().email().required(),
        phoneNumber: Joi.string().length(10).required(),
        schoolId: Joi.string().required()
    }),
}