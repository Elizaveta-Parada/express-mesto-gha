const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле "name" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },
  about: {
    type: String,
    required: [true, 'Поле "about" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },
  avatar: {
    type: String,
    required: [true, 'Поле "avatar" должно быть заполнено'],
    validate: { // опишем свойство validate
      validator(url) {
        return /^(?:http(s)?:\/\/)/.test(url);
      },
      message: 'Не корректная ссылка', // когда validator вернёт false, будет использовано это сообщение
    },
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
