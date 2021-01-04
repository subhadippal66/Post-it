const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().min(0).required(),
        image: Joi.string().required(),
        description: Joi.any()
    }).required()
});

module.exports.reviewSchema = Joi.object({
        body: Joi.string().required(),
        rating:Joi.number().min(1).max(5).required()
});