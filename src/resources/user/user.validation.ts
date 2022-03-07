import Joi from 'joi';
const registerUser = Joi.object({
    name: Joi.string().max(15).min(2).required(),
    email: Joi.string().email().required(),
});

const loginUser = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});
const updateUserEmail = Joi.object({
    email: Joi.string().email().required(),
});
const updateUserPassword = Joi.object({
    oldPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required(),
});
const updateUserName = Joi.object({
    name: Joi.string().max(15).min(2).required(),
});
const resetPasswordEmail = Joi.object({
    email: Joi.string().email().required(),
});
const resetPasswordCode = Joi.object({
    email: Joi.string().email().required(),
    digits: Joi.number().required(),
    newPassword: Joi.string().min(6).required(),
});

export default {
    registerUser,
    loginUser,
    updateUserEmail,
    updateUserPassword,
    updateUserName,
    resetPasswordEmail,
    resetPasswordCode,
};
