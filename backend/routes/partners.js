const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Partner = require('../models/Partner');

router.get('/', async (req, res, next) => {
    try {
        const partners = await Partner.find({ active: true }).sort({ order: 1 });
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
