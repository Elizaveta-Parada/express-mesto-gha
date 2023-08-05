const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const isUrl = require('validator/lib/isURL');

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
    require: true,
    validate: { // опишем свойство validate
      validator: (link) => isUrl(link),
      message: 'Не корректная ссылка', // когда validator вернёт false, будет использовано это сообщение
    },
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
