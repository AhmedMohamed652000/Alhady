const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');
const Banner = require('../models/Banner');

// GET all banners (optionally unfiltered for admin)
router.get('/', optionalAuth, async (req, res, next) => {
    try {
        const filter = req.admin ? {} : { active: true };
        const banners = await Banner.find(filter).sort({ order: 1 });
        res.json({ success: true, data: banners });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Reorder banners
router.patch('/reorder', auth, [
    body('items').isArray().withMessage('Items array is required'),
    body('items.*.id').notEmpty().withMessage('Each item must have an id'),
    body('items.*.order').isNumeric().withMessage('Each item must have a numeric order')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, message: errors.array()[0].msg });
    }

    try {
        const { items } = req.body;
        await Promise.all(items.map(({ id, order }) => 
            Banner.findOneAndUpdate({ page: id }, { order })
        ));
        res.json({ success: true, message: 'Banners reordered' });
    } catch (error) {
        next(error);
    }
});

// GET banner by page (filtered for website)
router.get('/:page', optionalAuth, async (req, res, next) => {
    try {
        const filter = req.admin ? { page: req.params.page } : { page: req.params.page, active: true };
        const banner = await Banner.findOne(filter);
        if (!banner) {
            return res.status(404).json({ success: false, message: 'Banner not found or inactive' });
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

// ADMIN: Partial update banner (e.g. toggle active)
router.patch('/:page', auth, async (req, res, next) => {
    try {
        const banner = await Banner.findOneAndUpdate(
            { page: req.params.page },
            { $set: req.body },
            { new: true }
        );
        if (!banner) {
            return res.status(404).json({ success: false, message: 'Banner not found' });
        }
        res.json({ success: true, data: banner });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
