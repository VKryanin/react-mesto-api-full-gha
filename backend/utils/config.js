const security = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev';
const { MONGO } = process.env;
const PORT = process.env.PORT || 3000;

module.exports = {
    security, MONGO, PORT,
};
