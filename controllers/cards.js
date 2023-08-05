const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ massage: 'На сервере произошла ошибка' }));
};

module.exports.addNewCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'validationError') {
        return res.status(400).send({
          message: `${Object.values(err.errors).map(() => err.message).join(', ')}`,
        });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.send({ message: 'Карточка удалена' });
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.putLikes = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'validationError') {
        return res.status(400).send({
          message: `${Object.values(err.errors).map(() => err.message).join(', ')}`,
        });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteLikes = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },

    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'validationError') {
        return res.status(400).send({
          message: `${Object.values(err.errors).map(() => err.message).join(', ')}`,
        });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};
