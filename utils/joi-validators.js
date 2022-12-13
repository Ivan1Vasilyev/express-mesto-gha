const { Joi } = require('celebrate');
const { REGEXP_URL } = require('./constants');

const joiNameOrAbout = (required) => (required
  ? Joi.string().required().min(2).max(30)
  : Joi.string().min(2).max(30));
const joiUrl = (required) => (required
  ? Joi.string().required().pattern(REGEXP_URL)
  : Joi.string().pattern(REGEXP_URL));
const joiEmail = () => Joi.string().required().email({ minDomainSegments: 2 });
const joiPassword = () => Joi.string().required().min(4);
const joiId = () => Joi.string().hex().required().length(24);

module.exports = {
  joiNameOrAbout,
  joiUrl,
  joiEmail,
  joiPassword,
  joiId,
};
