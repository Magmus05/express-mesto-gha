/* eslint-disable */
const express = require("express");
const mongoose = require("mongoose");
const { PORT = 3000 } = process.env;
const app = express();
const routesUsers = require("./routes/users");
const routesCards = require("./routes/cards");
const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: "64bea7bd27e3f9cd02a6a3dd", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
app.use("/users", routesUsers);
app.use("/cards", routesCards);

mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});
app.listen(PORT, () => {
  console.log(`слушаем порт: ${PORT}`);
});
