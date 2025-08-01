const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const geoip = require('geoip-lite');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
    // جلب بيانات المستخدم
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // الحصول على الدولة من IP
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress;
    // const ip = '8.8.8.8'
    const geo = geoip.lookup(ip) || {};
    const country = geo.country || 'US';

        console.log('Geo result:', geo);
    console.log('Country used for filtering:', country);

    const userAgent = req.headers['user-agent'] || '';
    const params = new URLSearchParams({ ip, user_agent: userAgent });
    const url = `https://unlockcontent.net/api/v2?${params.toString()}`;
    console.log('API URL:', url);
    console.log('API Key:', process.env.OFFERS_API_KEY);
    console.log('API Key:', process.env.OFFERS_API_KEY);

    const apiRes = await fetch(url, {
        headers: { Authorization: `Bearer ${process.env.OFFERS_API_KEY}` }
    });
    const data = await apiRes.json();
    console.log('Raw Offers:', data.offers);

    // فلترة العروض حسب الدولة، وإضافة aff_sub
    const offers = (data.offers || [])
        .filter(offer => offer.country?.includes(country))
        .map(offer => ({
            ...offer,
            link: offer.link + `&aff_sub=${user._id}`
        }));

    res.json({ offers });
});

module.exports = router;