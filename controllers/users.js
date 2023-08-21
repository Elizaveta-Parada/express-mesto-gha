const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => next(err));
};

module.exports.getMeUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(201).send(user))
    .catch((err) => next(err));
};

module.exports.addNewUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  const addNewUser = (hash) => User.create({
    name, about, avatar, email, password: hash,
  });
  bcrypt
    .hash(password, 10)
    .then((hash) => addNewUser(hash))
    .then(({ _id }) => res.status(201).send({
      _id, name, about, avatar, email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь уже зарегестрирован'));
      }
      if (err.name === 'ValidationError') {
        next(new ValidationError(`${Object.values(err.errors).map(() => err.message).join(', ')}`));
      }
      next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Введены не корректные данные'));
      }
      next(err);
    });
};

module.exports.editUser = (req, res, next) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: 'true', runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`${Object.values(err.errors).map(() => err.message).join(', ')}`));
      }
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь не найден'));
      }
      next(err);
    });
};

module.exports.editAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: 'true', runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`${Object.values(err.errors).map(() => err.message).join(', ')}`));
      }
      if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь не найден'));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' }),
      });
    })
    .catch((err) => {
      next(err);
    });
};
