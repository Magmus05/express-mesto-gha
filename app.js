/* eslint-disable */
const express = require("express");
const mongoose = require("mongoose");
const { PORT = 3000, DB_URL = "mongodb://127.0.0.1:27017/mestodb" } =
  process.env;
const app = express();
const routesUsers = require("./routes/users");
const routesCards = require("./routes/cards");
const bodyParser = require("body-parser");
const auth = require('./middlewares/auth');
const { errors } = require('celebrate');

app.use(bodyParser.json());

app.use("/", routesUsers);
app.use("/cards", routesCards);
app.use("/", (req, res) => {
  res.status(404).send({
    message: "Не верный адрес",
  });
});

app.use(errors());
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка1'
        : message
    });
});
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});
app.listen(PORT, () => {
  console.log(`слушаем порт: ${PORT}`);
});
