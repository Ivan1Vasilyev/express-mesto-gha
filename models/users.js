const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const { REGEXP_URL } = require('../utils/constants');
const NotAuthorizedError = require('../errors/not-authorized');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 2,
      maxLength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minLength: 2,
      maxLength: 30,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      validate: {
        validator: (v) => REGEXP_URL.test(v),
        message: (props) => `${props.value} is not a URL!`,
      },
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: (mail) => isEmail(mail),
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.static('findUserByCredentials', async function (email, password, next) {
  const user = await this.findOne({ email }).select('+password');
  if (!user) {
    return next(new NotAuthorizedError('Неправильные почта или пароль'));
  }

  const isLogged = await bcryptjs.compare(password, user.password);
  if (!isLogged) {
    return next(new NotAuthorizedError('Неправильные почта или пароль'));
  }
  delete user.password;
  console.log(user);
  return user;
});

module.exports = mongoose.model('user', userSchema);
