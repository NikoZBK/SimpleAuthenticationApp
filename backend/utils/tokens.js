import pkg from 'jsonwebtoken';
const { sign } = pkg;

export const createAccessToken = id => {
  return sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 15 * 60, // 15 minutes
  });
};

export const createRefreshToken = id => {
  return sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '90d',
  });
};

export const createPasswordResetToken = ({ _id, email, password }) => {
  const secret = password;
  return sign({ id: _id, email }, secret, {
    expiresIn: 15 * 60, // 15 minutes
  });
};

export const sendAccessToken = (_req, res, accessToken) => {
  res.json({
    accessToken,
    message: 'Sign in Successful',
    type: 'success',
  });
};

export const sendRefreshToken = (res, refreshtoken) => {
  res.cookie('refreshtoken', refreshtoken, {
    httpOnly: true,
  });
};

export default {
  createAccessToken,
  createRefreshToken,
  createPasswordResetToken,
  sendAccessToken,
  sendRefreshToken,
};
