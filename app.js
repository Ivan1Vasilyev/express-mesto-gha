const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { NOT_EXISTS, NOT_EXISTS_MESSAGE } = require('./utils/constants');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = { _id: '6385e70f76b4d04a20c3fb7c' };

  next();
});
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res) => res.status(NOT_EXISTS).json({ message: NOT_EXISTS_MESSAGE }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', { useNewUrlParser: true }, () => {
  console.log('connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`connected to port: ${PORT}`);
  });
});
