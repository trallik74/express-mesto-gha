const {
  PORT = 3000,
  DB_URL = 'mongodb://127.0.0.1:27017/mestodb',
  SALT_ROUNDS = 10,
  JWT_SECRET = 'jwt-secret-key',
  URL_REGEX = /https?:\/\/(www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]{2,}\.[a-zA-Z]{1,6}[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*#?/,
} = process.env;

module.exports = {
  PORT,
  DB_URL,
  SALT_ROUNDS,
  JWT_SECRET,
  URL_REGEX,
};
