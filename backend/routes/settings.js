const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const SiteSettings = require('../models/SiteSettings');

// GET site settings (singleton)
router.get('/', async (req, res, next) => {
    try {
        const settings = await SiteSettings.findOne();
        res.json({ success: true, data: settings || {} });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Update site settings (singleton)
router.put('/', auth, async (req, res, next) => {
    try {
        const settings = await SiteSettings.findOneAndUpdate(
            {},
            req.body,
            { upsert: true, new: true, runValidators: true }
        );
        res.json({ success: true, data: settings });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
