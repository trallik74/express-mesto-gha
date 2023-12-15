const express = require('express');
const mongoose = require('mongoose');
/* const cookieParser = require('cookie-parser'); */
const appRouter = require('./routes/index');
const { PORT } = require('./utils/config');

const DB_URL = 'mongodb://127.0.0.1:27017/mestodb';

const app = express();

app.use(express.json());
/* app.use(cookieParser()); */
app.use(appRouter);

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log('Соединение с Mongo установленно');
  })
  .catch((err) => {
    console.log(`Ошибка при установки соеденения с Mongo: ${err}`);
  });

app.listen(PORT, () => {
  console.log(`Сервер запущен на порте: ${PORT}`);
});
