/* eslint-disable */
const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
   // required: [true, 'Поле "name" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    //required: [true, 'Поле "about" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "about" - 2'],
    maxlength: [30, 'Максимальная длина поля "about" - 30'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    //required: [true, 'Поле "avatar" должно быть заполнено'],
    // validate: {
    //   validator: (v) => validator.isURL(v),
    //   message: "Некорректный URL",
    // },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: [true, 'Поле "email" должно быть заполнено'],
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "Некорректный Email",
    },
  },
  password: {
    type: String,
    required: [true, 'Поле "password" должно быть заполнено'],
    select: false
  },

},{versionKey: false});

userSchema.path('avatar').validate((val) => {
  urlRegex = /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/gmi;
  return urlRegex.test(val);
}, 'Невалидный URL.');

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {

      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль1'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          console.log(matched);
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль2'));
          }

          return user;
        });
    });
};


module.exports = mongoose.model("user", userSchema);