const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const isUrl = require('validator/lib/isURL');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: { // опишем свойство validate
      validator: (link) => isUrl(link),
      message: 'Не корректная ссылка', // когда validator вернёт false, будет использовано это сообщение
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'user',
  },
  likes: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'user',

  },
  createdAt: {
    type: Date,
    default: Date.now,

  },
}, { versionKey: false });

module.exports = mongoose.model('card', cardSchema);
