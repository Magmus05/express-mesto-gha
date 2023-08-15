/* eslint-disable */
const jwt = require('jsonwebtoken');
const ERROR_UNAUTHORIZED = 401;
module.exports = (req, res, next) => {
const token = req.headers.cookie.replace('jwt=', '')
  let payload;
  console.log(token);

  try {
    payload = jwt.verify(token, 'cibirkulimay');
  } catch (err) {
    return res
      .status(ERROR_UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
