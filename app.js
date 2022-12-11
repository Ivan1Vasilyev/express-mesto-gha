/* eslint-disable no-console */
const dotenv = require('dotenv');

dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
const { celebrate, Joi, errors } = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { DEFAULT_ERROR, NOT_EXISTS_MESSAGE } = require('./utils/constants');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found');
const { REGEXP_URL } = require('./utils/constants');

const { PORT = 3000 } = process.env;

const app = express();

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
// });

// app.use(helmet());
// app.use(limiter);
app.use(cookieParser());
app.use(bodyParser.json());
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email({ minDomainSegments: 2 }),
      password: Joi.string().required().min(4),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email({ minDomainSegments: 2 }),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(REGEXP_URL),
    }),
  }),
  createUser,
);
app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res, next) => {
  const err = new NotFoundError(NOT_EXISTS_MESSAGE);
  next(err);
});
app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = DEFAULT_ERROR, message } = err;
  return res
    .status(statusCode)
    .json({ message: statusCode === DEFAULT_ERROR ? 'На сервере произошла ошибка' : message });
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', { useNewUrlParser: true }, () => {
  console.log('connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`connected to port: ${PORT}`);
  });
});
