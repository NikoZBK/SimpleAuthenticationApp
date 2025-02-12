const { sign } = require('jsonwebtoken');

const createAccessToken = (id) => {
  return sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 15 * 60, // 15 minutes
  });
};

const createRefreshToken = (id) => {
  return sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '90d',
  });
};

const createPasswordResetToken = ({ _id, email, password }) => {
  const secret = password;
  return sign({ id: _id, email }, secret, {
    expiresIn: 15 * 60, // 15 minutes
  });
};

const sendAccessToken = (_req, res, accessToken) => {
  res.json({
    accessToken,
    message: 'Sign in Successful',
    type: 'success',
  });
};

const sendRefreshToken = (res, refreshtoken) => {
  res.cookie('refreshtoken', refreshtoken, {
    httpOnly: true,
  });
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  createPasswordResetToken,
  sendAccessToken,
  sendRefreshToken,
};
