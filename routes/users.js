const router = require('express').Router();
const {
  getUsers, addNewUser, getUserById, editUser, editAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', addNewUser);
router.patch('/me', editUser);
router.patch('/me/avatar', editAvatar);

module.exports = router;
