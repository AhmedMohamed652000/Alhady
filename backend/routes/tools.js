const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Tool = require('../models/Tool');

router.get('/', async (req, res, next) => {
    try {
        const tools = await Tool.find({ active: true }).sort({ order: 1 });
        res.json({ success: true, data: tools });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Create tool
router.post('/', auth, [
    body('title').notEmpty().withMessage('Title is required')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, message: errors.array()[0].msg });
    }

    try {
        const tool = await Tool.create(req.body);
        res.status(201).json({ success: true, data: tool });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Update tool
router.put('/:id', auth, [
    body('title').notEmpty().withMessage('Title is required')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, message: errors.array()[0].msg });
    }

    try {
        const tool = await Tool.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!tool) {
            return res.status(404).json({ success: false, message: 'Tool not found' });
        }
        res.json({ success: true, data: tool });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Delete tool
router.delete('/:id', auth, async (req, res, next) => {
    try {
        const tool = await Tool.findByIdAndDelete(req.params.id);
        if (!tool) {
            return res.status(404).json({ success: false, message: 'Tool not found' });
        }
        res.json({ success: true, message: 'Tool deleted' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
