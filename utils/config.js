const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb', SALT_ROUNDS = 10 } = process.env;

module.exports = {
  PORT,
  DB_URL,
  SALT_ROUNDS,
};
