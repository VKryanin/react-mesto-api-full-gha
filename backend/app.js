require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const errorListener = require('./midlwares/error');
const { requestLogger, errorLogger } = require('./midlwares/logger');
const routes = require('./routes');

const app = express();
app.use(cors());

const { PORT } = require('./utils/config');

const limiter = rateLimit({
  windowMs: 1000,
  max: 5000,
  standardHeaders: true,
  legacyHeaders: false,
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());


app.use(cookieParser());
app.use(helmet());
app.use(requestLogger);
app.use(limiter);
routes(app);

app.use(errorLogger);
app.use(errors());
app.use(errorListener);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Слушаю порт ${PORT}`);
});
