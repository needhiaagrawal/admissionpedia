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