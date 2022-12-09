const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace(/^Bearer\s/, '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  next();
};

module.exports = auth;
