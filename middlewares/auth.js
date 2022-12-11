const jwt = require('jsonwebtoken');
const NotAuthorizedError = require('../errors/not-authorized');

const { JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const cookieJwt = req.cookies.jwt;
  if (!cookieJwt) {
    next(new NotAuthorizedError('Необходима авторизация'));
    return;
  }
  const token = cookieJwt.replace(/^Bearer\s/, '');
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
