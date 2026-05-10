const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');
const Tool = require('../models/Tool');

// GET all tools (optionally unfiltered for admin)
router.get('/', optionalAuth, async (req, res, next) => {
    try {
        const filter = req.admin ? {} : { active: true };
        const tools = await Tool.find(filter).sort({ order: 1 });
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

// ADMIN: Reorder tools
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
            Tool.findByIdAndUpdate(id, { order })
        ));
        res.json({ success: true, message: 'Tools reordered' });
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

// ADMIN: Partial update tool (e.g. toggle active)
router.patch('/:id', auth, async (req, res, next) => {
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
