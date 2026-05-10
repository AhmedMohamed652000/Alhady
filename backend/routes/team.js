const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');
const Team = require('../models/Team');

router.get('/', optionalAuth, async (req, res, next) => {
    try {
        const filter = req.admin ? {} : { active: true };
        const team = await Team.find(filter).sort({ order: 1 }).lean();
        res.json({ success: true, data: team });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Create team member
router.post('/', auth, [
    body('name').notEmpty().withMessage('Name is required')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, message: errors.array()[0].msg });
    }

    try {
        const member = await Team.create(req.body);
        res.status(201).json({ success: true, data: member });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Reorder team members
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
            Team.findByIdAndUpdate(id, { order })
        ));
        res.json({ success: true, message: 'Team members reordered' });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Update team member
router.put('/:id', auth, [
    body('name').notEmpty().withMessage('Name is required')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, message: errors.array()[0].msg });
    }

    try {
        const member = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!member) {
            return res.status(404).json({ success: false, message: 'Team member not found' });
        }
        res.json({ success: true, data: member });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Partial update team member (e.g. toggle active)
router.patch('/:id', auth, async (req, res, next) => {
    try {
        const member = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!member) {
            return res.status(404).json({ success: false, message: 'Team member not found' });
        }
        res.json({ success: true, data: member });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Delete team member
router.delete('/:id', auth, async (req, res, next) => {
    try {
        const member = await Team.findByIdAndDelete(req.params.id);
        if (!member) {
            return res.status(404).json({ success: false, message: 'Team member not found' });
        }
        res.json({ success: true, message: 'Team member deleted' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
