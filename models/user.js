import pkg from 'mongoose';

const { Schema, model } = pkg;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  refreshtoken: {
    type: String,
  },
});

export default model('User', userSchema);
