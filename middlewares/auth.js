const jwt = require('jsonwebtoken');
const NotAuthorizedError = require('../errors/not-authorized');

const { JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new NotAuthorizedError('Необходима авторизация'));
    return;
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    next(new NotAuthorizedError('Необходима авторизация'));
    return;
  }

  req.user = { _id: payload._id };

  next();
};

module.exports = auth;
