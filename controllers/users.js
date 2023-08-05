const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.addNewUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: `${Object.values(err.errors).map(() => err.message).join(', ')}`,
        });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  if (userId.length === 24) {
    return User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: 'Пользователь не найден' });
        }
        return res.send(user);
      })
      .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
  }
  return res.status(400).send({ message: 'Введены не корректные данные' });
};

module.exports.editUser = (req, res) => {
  const { name, about } = req.body;
  if (req.user._id) {
    return User.findByIdAndUpdate(req.user._id, { name, about }, { new: 'true', runValidators: true })
      .then((user) => res.status(201).send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return res.status(400).send({
            message: `${Object.values(err.errors).map(() => err.message).join(', ')}`,
          });
        }
        return res.status(404).send({ message: 'Пользователь не найден' });
      });
  }
  return res.status(500).send({ message: 'На сервере произошла ошибка' });
};

module.exports.editAvatar = (req, res) => {
  const { avatar } = req.body;
  if (req.user._id) {
    User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return res.status(400).send({
            message: `${Object.values(err.errors).map(() => err.message).join(', ')}`,
          });
        }
        return res.status(404).send({ message: 'Пользователь не найден' });
      });
  } else {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};
