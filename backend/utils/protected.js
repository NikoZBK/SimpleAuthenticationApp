import pkg from 'jsonwebtoken';
const { verify } = pkg;

import User from '../models/user.js';

// * Middleware function to check if user is logged in
export const verified = async (req, res, next) => {
  // Get the token from the header
  const authorization = req.headers['authorization'];

  if (!authorization) {
    // ! No token found
    return res.status(500).json({
      message: 'No token found!',
      type: 'error',
    });
  }
  // * Token found, so verify it
  const token = authorization.split(' ')[1];
  let id;
  try {
    id = verify(token, process.env.ACCESS_TOKEN_SECRET).id;
  } catch {
    return res.status(500).json({
      message: 'Invalid token!',
      type: 'error',
    });
  }
  // Verify the token
  if (!id) {
    // ! Token is invalid
    return res.status(500).json({
      message: 'Invalid token!',
      type: 'error',
    });
  }
  // * Token is valid, so check if the user exists
  const user = await User.findById(id);

  if (!user) {
    // ! User doesn't exist
    return res.status(500).json({
      message: "User doesn't exist!",
      type: 'error',
    });
  }

  // * User exists, so add the user field to the request
  req.user = user;

  // Call the next middleware function
  next();
};

export default verified;
