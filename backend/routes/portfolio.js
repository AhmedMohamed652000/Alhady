const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');
const Portfolio = require('../models/Portfolio');

// GET all portfolio items (optionally unfiltered for admin)
router.get('/', optionalAuth, async (req, res, next) => {
    try {
        const filter = req.admin ? {} : { active: true };
        const portfolio = await Portfolio.find(filter).sort({ order: 1 });
        res.json({ success: true, data: portfolio });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Create portfolio item
router.post('/', auth, [
    body('title').notEmpty().withMessage('Title is required')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, message: errors.array()[0].msg });
    }

    try {
        const item = await Portfolio.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Reorder portfolio
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
            Portfolio.findByIdAndUpdate(id, { order })
        ));
        res.json({ success: true, message: 'Portfolio reordered' });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Update portfolio item
router.put('/:id', auth, [
    body('title').notEmpty().withMessage('Title is required')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, message: errors.array()[0].msg });
    }

    try {
        const item = await Portfolio.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!item) {
            return res.status(404).json({ success: false, message: 'Portfolio item not found' });
        }
        res.json({ success: true, data: item });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Partial update portfolio (e.g. toggle active)
router.patch('/:id', auth, async (req, res, next) => {
    try {
        const item = await Portfolio.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!item) {
            return res.status(404).json({ success: false, message: 'Portfolio item not found' });
        }
        res.json({ success: true, data: item });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Delete portfolio item
router.delete('/:id', auth, async (req, res, next) => {
    try {
        const item = await Portfolio.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Portfolio item not found' });
        }
        res.json({ success: true, message: 'Portfolio item deleted' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
