require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const router = require('./routes');
const errorListener = require('./midlwares/error');

const app = express();
app.use(cors());
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const limiter = rateLimit({
  windowMs: 1000,
  max: 5000,
  standardHeaders: true,
  legacyHeaders: false,
});

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.use(express.json());

app.use(limiter);
app.use(cookieParser());

app.use(requestLogger);

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorListener);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Слушаю порт 3000');
});
