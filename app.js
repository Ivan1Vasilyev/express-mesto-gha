require('dotenv').config();

// dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const cors = require('cors');
const router = require('./routes');
const { DEFAULT_ERROR, NOT_EXISTS_MESSAGE } = require('./utils/constants');
const NotFoundError = require('./errors/not-found');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const allowedCors = ['http://shaloban.students.nomoredomains.club/', 'localhost:3000'];

const corsOptions = {
  origin: allowedCors,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(limiter);
app.use(cookieParser());
app.use(express.json());
app.use(requestLogger);
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(router);
app.use('*', (req, res, next) => {
  next(new NotFoundError(NOT_EXISTS_MESSAGE));
});
app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = DEFAULT_ERROR, message } = err;
  return res
    .status(statusCode)
    .json({ message: statusCode === DEFAULT_ERROR ? 'На сервере произошла ошибка' : message });
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', { useNewUrlParser: true }, (err) => {
  if (err) {
    console.log(`Can't connect to MongoDB. ${err}`);
    return;
  }
  console.log('connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`connected to port: ${PORT}`);
  });
});
