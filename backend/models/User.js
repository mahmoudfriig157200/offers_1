const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String, // مشفر
  points: { type: Number, default: 0 },
  country: String
});

module.exports = mongoose.model('User', userSchema);