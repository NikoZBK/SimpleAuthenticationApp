const { sign } = require('jsonwebtoken');

const createAccessToken = id => {
  return sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 15 * 60,
  });
};

const createRefreshToken = id => {
  return sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '90d',
  });
};

const createEmailVerifyToken = id => {
  return sign({ id }, process.env.EMAIL_VERIFY_TOKEN_SECRET, {
    expiresIn: 15 * 60,
  });
};

const sendAccessToken = (_req, res, accessToken) => {
  res.json({
    accessToken,
    message: 'Sign in Successful',
    type: 'success',
  });
};

const sendRefreshToken = (res, refreshToken) => {
  res.cookie('refreshtoken', refreshToken, {
    httpOnly: true,
  });
};

const sendEmailVerifyToken = (_req, res, emailVerifyToken) => {
  res.json({
    emailVerifyToken,
    message: 'Email Verified',
    type: 'success',
  });
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  createEmailVerifyToken,
  sendAccessToken,
  sendRefreshToken,
  sendEmailVerifyToken,
};
