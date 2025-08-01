const mongoose = require('mongoose');
require('dotenv').config();

function connectDB() {
  return mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

module.exports = connectDB;