const jwt = require('jsonwebtoken');
const NotAuthorizedError = require('../errors/not-authorized');

const JWT_SECRET = '92f9a674d2d7093310eecc48970e81e7775554fbe4fa27ab9ea85ffefe7daa1a';

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
