const router = require('express').Router();
const {
  getCards, addNewCard, deleteCard, putLikes, deleteLikes,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', addNewCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', putLikes);
router.delete('/:cardId/likes', deleteLikes);

module.exports = router;
