// TODO: Convert CommonJS to ES modules
// * For learning purposes, I am sticking with CommonJS until the project is complete
import dotenv from 'dotenv/config';

import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import pkg from 'mongoose';
const { connect } = pkg;
import indexRouter from './routes/index.js';
import authRouter from './routes/auth.js';

const PORT = process.env.PORT || 8080;

const app = express();

app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/auth', authRouter);

app.listen(PORT, () => {
  console.log(`🚀 Listening on port ${PORT}`);
});

connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connection established successfully!'));
