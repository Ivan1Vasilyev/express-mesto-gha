const jwt = require('jsonwebtoken');
const NotAuthorizedError = require('../errors/not-authorized');

const { JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  try {
    const cookieJwt = req.cookies.jwt;
    if (!cookieJwt || !cookieJwt.startsWith('Bearer ')) {
      throw new NotAuthorizedError('Необходима авторизация');
    }
    const token = cookieJwt.replace(/^Bearer\s/, '');
    let payload;

    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      const err = new NotAuthorizedError('Необходима авторизация');
      next(err);
    }

    req.user = { _id: payload.id };

    next();
  } catch (e) {
    next(e);
  }
};

module.exports = auth;
