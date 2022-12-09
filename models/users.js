const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 2,
      maxLength: 30,
      required: true,
    },
    about: {
      type: String,
      minLength: 2,
      maxLength: 30,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: (mail) => validator.isEmail(mail),
        message: (props) => `${props.value} is not a valid email!`,
      },
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
