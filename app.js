// TODO: Convert CommonJS to ES modules
// * For learning purposes, I am sticking with CommonJS until the project is complete
require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const indexRouter = require('./backend/routes/index').default;
const authRouter = require('./backend/routes/auth').default;

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/auth', authRouter);

app.listen(PORT, () => {
  console.log(`🚀 Listening on port ${PORT}`);
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connection established successfully!'));
