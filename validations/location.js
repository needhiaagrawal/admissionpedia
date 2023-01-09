import Joi from 'joi';

export const getSchoolLocations = {
    query: Joi.object().keys({
        keyword: Joi.string().required()
    }),
};