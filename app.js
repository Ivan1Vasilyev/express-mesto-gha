const dotenv = require('dotenv');

dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { NOT_EXISTS, NOT_EXISTS_MESSAGE } = require('./utils/constants');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res) => res.status(NOT_EXISTS).json({ message: NOT_EXISTS_MESSAGE }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', { useNewUrlParser: true }, () => {
  console.log('connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`connected to port: ${PORT}`);
  });
});
