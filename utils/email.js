import { createTransport } from 'nodemailer';

export const createPasswordResetUrl = (id, token) =>
  `${process.env.PROTOCOL}://${process.env.CLIENT_URL}:${process.env.PORT}/reset-password/${id}/${token}`;

export const transporter = createTransport({
  service: process.env.EMAIL_HOST,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const passwordResetTemplate = (user, url) => {
  const { username, email } = user;
  return {
    from: `Mail - <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Reset Password`,
    html: `
        <h2>Password Reset Link</h2>
        <p>Reset your password by clicking on the link below:</p>
        <a href=${url}><button>Reset Password</button></a>
        <br />
        <br />
        <small><a style="color: #38A169" href=${url}>${url}</a></small>
        <br />
        <small>The link will expire in 15 mins!</small>
        <small>If you haven't requested a password reset, please make sure your account is secure, otherwise you can ignore this email.</small>
        <br /><br />
        <p>Thanks,</p>
        <p>Auth API Demo by Nikolay Ostroukhov</p>`,
  };
};

export const passwordResetConfirmationTemplate = user => {
  const { email } = user;
  return {
    from: `Mail - <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Password Reset Successful`,
    html: `
        <h2>Password Reset Successful</h2>
        <p>You've successfully updated your password for account: <${email}>. </p>
        <small>If this wasn't you, someone may have gained unauthorized access to your account. Please secure your email account as soon as possible before resetting your password.</small>
        <br /><br />
        <p>Thanks,</p>
        <p>Auth API Demo by Nikolay Ostroukhov</p>`,
  };
};

export default {
  transporter,
  createPasswordResetUrl,
  passwordResetTemplate,
  passwordResetConfirmationTemplate,
};
