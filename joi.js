const joi=require('joi');
module.exports.userSchema=joi.object({
    docu:joi.object({
        title:joi.string().required(),
        description:joi.string().allow(null,""),
        image:joi.string().allow("",null),
        location:joi.string().required(),
        country:joi.string().required().pattern(/^[A-Za-z\s]+$/).min(2),
        price:joi.number().required().min(0)
    })
})