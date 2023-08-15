/* eslint-disable */
const jwt = require('jsonwebtoken');
const ERROR_UNAUTHORIZED = 401;
const { UNAUTHORIZED_ERROR } = require("../errors/errors");
module.exports = (req, res, next) => {
  if(!req.headers.cookie)   return res
  .status(ERROR_UNAUTHORIZED)
  .send({ message: 'Необходима авторизация' });
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
  next(); // пропускаем запрос дальше
};
