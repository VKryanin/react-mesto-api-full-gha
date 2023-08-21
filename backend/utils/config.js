const isProduction = process.env.NODE_ENV === 'production';
const security = isProduction ? process.env.JWT_SECRET : 'dev';
const { MONGO } = process.env;
// const PORT = process.env.PORT || 3001;
const PORT = 3001;

module.exports = {
  security, MONGO, PORT,
};
