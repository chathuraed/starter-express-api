const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'owner', 'driver', 'conductor', 'passenger'],
    required: true,
  },
  // Add more fields as needed
});

const User = mongoose.model('User', userSchema);

module.exports = User;
