const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');
const Partner = require('../models/Partner');

// GET all partners (optionally unfiltered for admin)
router.get('/', optionalAuth, async (req, res, next) => {
    try {
        const filter = req.admin ? {} : { active: true };
        const partners = await Partner.find(filter).sort({ order: 1 }).lean();
        res.json({ success: true, data: partners });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Create partner
router.post('/', auth, [
    body('title').notEmpty().withMessage('Title is required')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, message: errors.array()[0].msg });
    }

    try {
        const partner = await Partner.create(req.body);
        res.status(201).json({ success: true, data: partner });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Reorder partners
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
            Partner.findByIdAndUpdate(id, { order })
        ));
        res.json({ success: true, message: 'Partners reordered' });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Update partner
router.put('/:id', auth, [
    body('title').notEmpty().withMessage('Title is required')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, message: errors.array()[0].msg });
    }

    try {
        const partner = await Partner.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!partner) {
            return res.status(404).json({ success: false, message: 'Partner not found' });
        }
        res.json({ success: true, data: partner });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Partial update partner (e.g. toggle active)
router.patch('/:id', auth, async (req, res, next) => {
    try {
        const partner = await Partner.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!partner) {
            return res.status(404).json({ success: false, message: 'Partner not found' });
        }
        res.json({ success: true, data: partner });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Delete partner
router.delete('/:id', auth, async (req, res, next) => {
    try {
        const partner = await Partner.findByIdAndDelete(req.params.id);
        if (!partner) {
            return res.status(404).json({ success: false, message: 'Partner not found' });
        }
        res.json({ success: true, message: 'Partner deleted' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
