const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Banner = require('../models/Banner');

// GET all banners
router.get('/', async (req, res, next) => {
    try {
        const banners = await Banner.find({});
        res.json({ success: true, data: banners });
    } catch (error) {
        next(error);
    }
});

// GET banner by page
router.get('/:page', async (req, res, next) => {
    try {
        const banner = await Banner.findOne({ page: req.params.page });
        if (!banner) {
            return res.status(404).json({ success: false, message: 'Banner not found' });
        }
        res.json({ success: true, data: banner });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Update banner (singleton by page)
router.put('/:page', auth, [
    body('title').notEmpty().withMessage('Title is required'),
    body('page').isIn(['home','about','service','project','portfolio','team','contact','faq']).withMessage('Invalid page value')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, message: errors.array()[0].msg });
    }

    try {
        const banner = await Banner.findOneAndUpdate(
            { page: req.params.page },
            req.body,
            { upsert: true, new: true, runValidators: true }
        );
        res.json({ success: true, data: banner });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
