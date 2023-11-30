const {
  HTTP_STATUS_NOT_FOUND,
} = require('node:http2').constants;
const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('*', (req, res) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Запрашиваемый ресурс не найден' });
});

module.exports = router;
