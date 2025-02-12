import { Router } from 'express';
import pkgbcryptjs from 'bcryptjs';
const { hash, compare } = pkgbcryptjs;
import pkgjsonwebtoken from 'jsonwebtoken';
const { verify } = pkgjsonwebtoken;
import { verified } from '../utils/protected.js';
import {
  transporter,
  createPasswordResetUrl,
  passwordResetTemplate,
  passwordResetConfirmationTemplate,
} from '../utils/email.js';
import {
  createAccessToken,
  createRefreshToken,
  createPasswordResetToken,
  sendAccessToken,
  sendRefreshToken,
} from '../utils/tokens.js';

import User from '../models/user.js';

const router = Router();

/* Endpoints */

/**
 * @route POST /logout
 * @group Authentication - Operations related to user authentication
 * @returns {object} 200 - User logged out successfully
 * @returns {Error} 500 - Error logging out
 */
router.post('/logout', (_req, res) => {
  // clear cookies
  res.clearCookie('refreshtoken');
  return res.json({
    message: 'Logged out successfully!',
    type: 'success',
  });
});
/**
 * @route GET /protected
 * @group Authentication - Operations related to user authentication
 * @returns {object} 200 - User is logged in
 * @returns {Error} 500 - User is not logged in | Other error occurred
 * @security JWT
 */
router.get('/protected', verified, async (req, res) => {
  console.log(`GET /protected`);
  try {
    // Check if user exists
    if (req.user) {
      // * User exists
      return res.json({
        message: 'You are logged in.',
        type: 'success',
        user: req.user,
      });
    }
    // ! User does not exist
    return res.status(500).json({
      message: 'You are not logged in.',
      status: 'error',
    });
  } catch (error) {
    res.status(500).json({
      type: 'error',
      message: 'Error getting protected route!',
      error,
    });
  }
});
/**
 * @route POST /refresh_token
 * @group Authentication - Operations related to user authentication
 * @returns {object} 200 - Token refreshed successfully status along with new access token
 * @returns {Error} 500 - No refresh token | Invalid refresh token | User does not exist | Other error occurred
 */
router.post('/refresh_token', async (req, res) => {
  console.log(`POST /refresh_token`);
  try {
    // Grab the refresh token from the cookies
    const { refreshtoken } = req.cookies;

    if (!refreshtoken) {
      // ! Refresh token does not exist
      return res.status(500).json({
        message: 'No refresh token!',
        status: 'error',
      });
    }

    // * Refresh token found, so verify it
    let id;
    try {
      id = verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET).id;
    } catch (error) {
      return res.status(500).json({
        message: 'Invalid refresh token!',
        status: 'error',
      });
    }
    // * Refresh token is valid, so check if the user even exists
    const user = await findById(id);
    if (!user) {
      // ! User does not exist
      return res.status(500).json({
        message: "User doesn't exist!",
        status: 'error',
      });
    }

    // * User exists, so now check if the refresh token is correct
    if (user.refreshtoken !== refreshtoken) {
      // ! Refresh token doesn't match
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

/**
 * @route POST /reset-password/:id/:token
 * @group Authentication - Operations related to user authentication
 * @param {string} id.path.required - user's id
 * @param {string} token.path.required - user's password reset token
 * @param {string} newPassword.body.required - user's new password
 * @returns {object} 200 - Password successfully changed and confirmation email sent successfully
 * @returns {Error} 500 - User does not exist | Invalid token | Error sending email
 */
router.post('/reset-password/:id/:token', async (req, res) => {
  console.log(`POST /reset-password/:id/:token`);
  try {
    const { id, token } = req.params;
    const { newPassword } = req.body;

    // Check if user exists
    const user = await findById(id);

    if (!user) {
      // ! User does not exist
      return res.status(500).json({
        message: "User doesn't exist!",
        type: 'error',
      });
    }
    // * User exists, so verify the token
    const isValid = verify(token, user.password);

    // Verify the token
    if (!isValid) {
      // ! Token is invalid
      return res.status(500).json({
        message: 'Invalid token!',
        type: 'error',
      });
    }
    // Set the user's password to the new password
    user.password = await hash(newPassword, 10);

    await user.save();

    // Send the password reset confirmation email
    const mailOptions = passwordResetConfirmationTemplate(user);
    transporter.sendMail(mailOptions, (err, _info) => {
      if (err) {
        // ! Error sending email
        return res.status(500).json({
          message: 'Error sending email!',
          type: 'error',
        });
      }
      // * Email sent successfully
      return res.json({
        message: 'Email sent!',
        type: 'success',
      });
    });
  } catch (error) {
    res.status(500).json({
      type: 'error',
      message: 'Error sending email!',
      error,
    });
  }
});
/**
 * @route POST /send-password-reset-email
 * @group Authentication - Operations related to user authentication
 * @param {string} email.body.required - user's email
 * @returns {object} 200 - Password reset email sent successfully
 * @returns {Error} 500 - User does not exist | Error sending email
 */
router.post('/send-password-reset-email', async (req, res) => {
  console.log(`POST /send-password-reset-email`);
  try {
    const { email } = req.body;
    // Check if user exists
    const user = await findOne({ email });

    if (!user) {
      // ! User does not exist
      return res.status(500).json({
        message: "User doesn't exist!",
        type: 'error',
      });
    }
    // * User exists, so create the password reset token
    const token = createPasswordResetToken(user);
    // Create the password reset url
    const url = createPasswordResetUrl(user._id, token);
    // Send the password reset email
    const mailOptions = passwordResetTemplate(user, url);
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(500).json({
          message: 'Error sending email!',
          type: 'error',
          err,
        });
      }
      // * Email sent successfully
      return res.json({
        message: 'Password reset link has been sent to your email!',
        type: 'success',
      });
    });
  } catch (error) {
    res.status(500).json({
      type: 'error',
      message: 'Error sending email!',
      error,
    });
  }
});
/**
 * @route POST /signin
 * @group Authentication - Operations related to user authentication
 * @param {string} email.body.required - user's email
 * @param {string} password.body.required - user's password
 * @returns {object} 200 - User signed in successfully
 * @returns {Error} 500 - Account does not exist | Password is incorrect | Other error occurred
 */
router.post('/signin', async (req, res) => {
  console.log(`POST /signin`);
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await findOne({ email: email });

    if (!user) {
      // ! User does not exist
      return res.status(500).json({
        message: "User doesn't exist!",
        type: 'error',
      });
    }

    // * User exists, so proceed with password check
    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      // ! Password doesn't match
      return res.status(500).json({
        message: 'Password is incorrect!',
        type: 'error',
      });
    }

    // * Password matches, so create the tokens
    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    // Add refresh token to the db
    user.refreshtoken = refreshToken;
    await user.save();

    // Finally, send the response (the access and refresh tokens)
    sendRefreshToken(res, refreshToken);
    sendAccessToken(req, res, accessToken);

    console.log(`Refresh token sent`);
  } catch (error) {
    res.status(500).json({
      type: 'error',
      message: 'Error signing in!',
      error,
    });
  }
});
/**
 * @route POST /signup
 * @group Authentication - Operations related to user authentication
 * @param {string} email.body.required - user's email
 * @param {string} password.body.required - user's password
 * @returns {object} 200 - User created successfully
 * @returns {Error} 500 - Account already exists | Other error occurred
 */
router.post('/signup', async (req, res) => {
  console.log(`POST /signup`);
  try {
    const { email, password } = req.body;
    // Check if user exists first
    const user = await findOne({ email: email });

    if (user) {
      // ! User already exists
      return res.status(500).json({
        message: 'Account already exists, please try logging in.',
        type: 'warning',
      });
    }
    // * User does not exist, so create the user and hash the password
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

export default router;
