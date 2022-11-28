const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use('/users', userRouter);

mongoose.connect(
  'mongodb://localhost:27017/mestodb',
  {
    useNewUrlParser: true,
  },
  () => {
    console.log('connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`connected to port: ${PORT}`);
    });
  }
);
