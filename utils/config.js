const {
  PORT = 3000,
  DB_URL = 'mongodb://127.0.0.1:27017/mestodb',
  SALT_ROUNDS = 10,
  JWT_ACCESS_SECRET = 'jwt-secret-key',
  WEEK_IN_MS = 604800000,
  URL_REGEX = /https?:\/\/(www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]{2,}\.[a-zA-Z]{1,6}[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*#?/,
} = process.env;

module.exports = {
  PORT,
  DB_URL,
  SALT_ROUNDS,
  JWT_ACCESS_SECRET,
  WEEK_IN_MS,
  URL_REGEX,
};
