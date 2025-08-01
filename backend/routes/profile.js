const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ميدلوير التحقق من التوكن
function auth(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ msg: 'Invalid token' });
  }
}

router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ msg: 'User not found' });
  res.json({
    email: user.email,
    points: user.points,
    completedOffers: user.completedOffers
  });
});

module.exports = router;