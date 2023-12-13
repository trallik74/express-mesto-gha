const router = require('express').Router();
const {
  readUser,
  readAllUsers,
  updateUserProfile,
  updateUserAvatar,
  readCurrentUser,
} = require('../controllers/users');

router.get('/', readAllUsers);
router.get('/me', readCurrentUser);
router.get('/:userId', readUser);
router.patch('/me', updateUserProfile);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
