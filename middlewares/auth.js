/* eslint-disable */
const jwt = require('jsonwebtoken');
const ERROR_UNAUTHORIZED = 401;
module.exports = (req, res, next) => {
const token = req.headers.cookie.replace('jwt=', '')

  let payload;

  try {
    payload = jwt.verify(token, 'cibirkulimay');
  } catch (err) {
    return res
      .status(ERROR_UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }
  req.user = payload; // записываем пейлоуд в объект запроса
console.log(req.user);
  next(); // пропускаем запрос дальше
};
