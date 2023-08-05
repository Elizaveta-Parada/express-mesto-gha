const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: { // опишем свойство validate
      validator(url) {
        return /^(?:http(s)?:\/\/)/.test(url);
      },
      message: 'Не корректная ссылка', // когда validator вернёт false, будет использовано это сообщение
    },
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
