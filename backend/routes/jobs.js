const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');
const Job = require('../models/Job');

// GET all jobs
router.get('/', optionalAuth, async (req, res, next) => {
    try {
        const filter = req.admin ? {} : { active: true };
        const jobs = await Job.find(filter).sort({ order: 1 }).lean();
        res.json({ success: true, data: jobs });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Create job
router.post('/', auth, [
    body('title').notEmpty().withMessage('Title is required')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, message: errors.array()[0].msg });
    }

    try {
        const job = await Job.create(req.body);
        res.status(201).json({ success: true, data: job });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Reorder jobs
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
            Job.findByIdAndUpdate(id, { order })
        ));
        res.json({ success: true, message: 'Jobs reordered' });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Update job
router.put('/:id', auth, [
    body('title').notEmpty().withMessage('Title is required')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, message: errors.array()[0].msg });
    }

    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }
        res.json({ success: true, data: job });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Partial update job
router.patch('/:id', auth, async (req, res, next) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }
        res.json({ success: true, data: job });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Delete job
router.delete('/:id', auth, async (req, res, next) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }
        res.json({ success: true, message: 'Job deleted' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
