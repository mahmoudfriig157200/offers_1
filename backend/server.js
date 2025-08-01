const express = require('express');
const connectDB = require('./config');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

connectDB().then(() => console.log('MongoDB Connected'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/offers', require('./routes/offers'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/postback', require('./routes/postback'));

app.get('/api/test', (req, res) => {
  res.json({ message: "Backend is working!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));