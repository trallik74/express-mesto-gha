const {
  HTTP_STATUS_NOT_FOUND,
} = require('node:http2').constants;
const router = require('express').Router();
const { createUser, loginUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const errorHandler = require('../middlewares/error-handler');
const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.post('/signin', loginUser);
router.post('/signup', createUser);
router.use(auth);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('*', (req, res) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' });
});
router.use(errorHandler);

module.exports = router;
