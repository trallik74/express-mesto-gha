const router = require('express').Router();
const {
  readUser,
  readAllUsers,
  updateUserProfile,
  updateUserAvatar,
  readCurrentUser,
} = require('../controllers/users');
const {
  validateUpdateUserAvatar,
  validateUpdateUserProfile,
} = require('../middlewares/validateRequest');

router.get('/', readAllUsers);
router.get('/me', readCurrentUser);
router.get('/:userId', readUser);
router.patch('/me', validateUpdateUserProfile, updateUserProfile);
router.patch('/me/avatar', validateUpdateUserAvatar, updateUserAvatar);

module.exports = router;
