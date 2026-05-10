const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');
const Review = require('../models/Review');

// GET all reviews (optionally unfiltered for admin)
router.get('/', optionalAuth, async (req, res, next) => {
    try {
        const filter = req.admin ? {} : { active: true };
        const reviews = await Review.find(filter).sort({ order: 1 });
        res.json({ success: true, data: reviews });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Create review
router.post('/', auth, [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, message: errors.array()[0].msg });
    }

    try {
        const review = await Review.create(req.body);
        res.status(201).json({ success: true, data: review });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Reorder reviews
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
            Review.findByIdAndUpdate(id, { order })
        ));
        res.json({ success: true, message: 'Reviews reordered' });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Update review
router.put('/:id', auth, [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, message: errors.array()[0].msg });
    }

    try {
        const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        res.json({ success: true, data: review });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Partial update review (e.g. toggle active)
router.patch('/:id', auth, async (req, res, next) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        res.json({ success: true, data: review });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Delete review
router.delete('/:id', auth, async (req, res, next) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        res.json({ success: true, message: 'Review deleted' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
