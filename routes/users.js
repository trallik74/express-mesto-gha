const router = require('express').Router();
const {
  readUser,
  readAllUsers,
  createUser,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', readAllUsers);
router.post('/', createUser);
router.get('/:userId', readUser);
router.patch('/me', updateUserProfile);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
