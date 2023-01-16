import Joi from 'joi';

export const admissionStatus = {
    body: Joi.object().keys({
        schoolId: Joi.string().required(),
        classIds: Joi.array().allow([]),
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().required(),
    }),
};
