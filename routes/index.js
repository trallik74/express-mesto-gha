const router = require('express').Router();
const { errors } = require('celebrate');
const { createUser, loginUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const errorHandler = require('../middlewares/error-handler');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { valiateCreateUser, validateLoginUser } = require('../middlewares/validateRequest');
const NotFoundError = require('../exeptions/not-found-error');

router.post('/signin', validateLoginUser, loginUser);
router.post('/signup', valiateCreateUser, createUser);
router.use(auth);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('*', (req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден')));
router.use(errors());
router.use(errorHandler);

module.exports = router;
