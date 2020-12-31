const BaseJoi = require('joi');
const mongoose  = require('mongoose');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const joi = BaseJoi.extend(extension);


module.exports.CampgroundSchema = joi.object({
    campground:joi.object({
        title:joi.string().required().escapeHTML(),
        price:joi.number().min(0).required(),
        // image:joi.string().required(),
        location:joi.string().required().escapeHTML(),
        description:joi.string().required().escapeHTML()
    }).required(),
    deleteImages:joi.array()
});

module.exports.ReviewSchema = joi.object({
    Review:joi.object({
        rating:joi.number().required().min(1).max(5),
        body:joi.string().required().escapeHTML()
    }).required()
});