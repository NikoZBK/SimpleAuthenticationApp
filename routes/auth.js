const express = require('express');
const router = express.Router();
const { hash, compare } = require('bcryptjs');
const { verify } = require('jsonwebtoken');

const {
  createAccessToken,
  createRefreshToken,
  createEmailVerifyToken,
  sendAccessToken,
  sendRefreshToken,
  sendEmailVerifyToken,
} = require('../utils/tokens');

const User = require('../models/user');

/* Endpoints */

// SIGN UP
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user exists first
    const user = await User.findOne({ email: email });

    if (user) {
      // User already exists, get outta here
      return res.status(500).json({
        message: 'Account already exists, please try logging in.',
        type: 'warning',
      });
    }
    // User does not exist, so create the user and hash the password
    const passwordHash = await hash(password, 10);
    const newUser = new User({
      email: email,
      password: passwordHash,
    });

    // Save user to db
    await newUser.save();

    res.status(200).json({
      message: 'User created successfully!',
      type: 'success',
    });
  } catch (error) {
    res.status(500).json({
      type: 'error',
      message: 'Error creating user!',
      error,
    });
  }
});
// SIGN IN
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(500).json({
        message: "User doesn't exist!",
        type: 'error',
      });
    }

    // User exists, so proceed with password check
    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      return res.status(500).json({
        message: 'Password is incorrect!',
        type: 'error',
      });
    }

    // Password matches, so create the tokens
    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    // Add refresh token to the db
    user.refreshtoken = refreshToken;
    await user.save();

    // Finally, send the response (the access and refresh tokens)
    sendAccessToken(req, res, accessToken);
    sendRefreshToken(res, refreshToken);
  } catch (error) {
    res.status(500).json({
      type: 'error',
      message: 'Error signing in!',
      error,
    });
  }
});
// LOG OUT
router.post('/logout', async (_req, res) => {
  try {
    res.clearCookie('refreshtoken');
    return res.json({
      message: 'Logged out successfully!',
      type: 'success',
    });
  } catch (error) {
    res
      .status(500)
      .json({ type: 'error', message: 'Error logging out!', error });
  }
});
// REFRESH ACCESS TOKEN
router.post('/refresh_token', async (req, res) => {
  try {
    const { refreshtoken } = req.cookies;

    if (!refreshtoken) {
      return res.status(500).json({
        message: 'No refresh token!',
        status: 'error',
      });
    }

    // Refresh token successfully created, so verify it
    let id;
    try {
      id = verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET).id;
    } catch (error) {
      return res.status(500).json({
        message: 'Invalid refresh token!',
        status: 'error',
      });
    }
    // Refresh token is valid, so check if the user even exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(500).json({
        message: "User doesn't exist!",
        status: 'error',
      });
    }

    // User exists, so now check if the refresh token is correct
    if (user.refreshtoken !== refreshtoken) {
      return res.status(500).json({
        message: 'Invalid refresh token!',
        status: 'error',
      });
    }

    // Refresh token is correct, so now create new tokens
    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    // Update the user's refresh token
    user.refreshtoken = refreshToken;

    // Finally, send the new tokens in the response
    sendRefreshToken(res, refreshToken);

    return res.json({
      message: 'Refreshed successfully!',
      status: 'success',
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error refreshing token!',
      type: 'error',
    });
  }
});

module.exports = router;
