const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        image: Joi.object({
            path: Joi.string(),
            name : Joi.string()
        }),
        description: Joi.any()
    })
});

module.exports.reviewSchema = Joi.object({
        body: Joi.string().required(),
        rating:Joi.number().min(1).max(5).required()
});