const express = require('express');
const router = express.Router();
const { hash, compare } = require('bcryptjs');
const {
  createAccessToken,
  createRefreshToken,
  createEmailVerifyToken,
  sendAccessToken,
  sendRefreshToken,
  sendEmailToken,
} = require('../utils/tokens');
// import the user model
const User = require('../models/user');

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user exists first
    const user = await User.findOne({ email: email });
    // User already exists, get outta here
    if (user) {
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
    // Successfully saved user
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

module.exports = router;
