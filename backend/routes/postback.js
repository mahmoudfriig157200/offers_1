const express = require('express');
const router = express.Router();
const User = require('../models/User');

// مثال: /api/postback?user_id=USERID&payout=0.39&offer_id=123
router.get('/', async (req, res) => {
    const { user_id, payout, offer_id } = req.query;
    if (!user_id || !payout) return res.send('Missing Data');
    const points = Math.round(parseFloat(payout) * 100);
    await User.findByIdAndUpdate(user_id, { $inc: { points } });
    // يمكنك تسجيل العرض المكتمل هنا في جدول منفصل لمنع التكرار
    res.send('OK');
});

module.exports = router;