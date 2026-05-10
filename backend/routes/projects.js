const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');
const Project = require('../models/Project');

// GET all projects (optionally unfiltered for admin)
router.get('/', optionalAuth, async (req, res, next) => {
    try {
        const filter = req.admin ? {} : { active: true };
        const projects = await Project.find(filter).sort({ order: 1 });
        res.json({ success: true, data: projects });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Create project
router.post('/', auth, [
    body('title').notEmpty().withMessage('Title is required')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, message: errors.array()[0].msg });
    }

    try {
        const project = await Project.create(req.body);
        res.status(201).json({ success: true, data: project });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Reorder projects
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
            Project.findByIdAndUpdate(id, { order })
        ));
        res.json({ success: true, message: 'Projects reordered successfully' });
    } catch (error) {
        next(error);
    }
});

// GET single project by ID (filtered for website)
router.get('/:id', optionalAuth, async (req, res, next) => {
    try {
        const filter = req.admin ? { _id: req.params.id } : { _id: req.params.id, active: true };
        const project = await Project.findOne(filter);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found or inactive' });
        }
        res.json({ success: true, data: project });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Update project
router.put('/:id', auth, [
    body('title').notEmpty().withMessage('Title is required')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, message: errors.array()[0].msg });
    }

    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        res.json({ success: true, data: project });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Partial update project (e.g. toggle active)
router.patch('/:id', auth, async (req, res, next) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        res.json({ success: true, data: project });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Replace all project gallery samples
router.put('/:id/samples', auth, async (req, res, next) => {
    try {
        const { samples } = req.body; // array of { image, title, description }
        if (!Array.isArray(samples)) {
            return res.status(422).json({ success: false, message: 'samples must be an array' });
        }
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { $set: { projectSamples: samples } },
            { new: true, runValidators: true }
        );
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        res.json({ success: true, data: project });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Add a single sample image to project gallery
router.post('/:id/samples', auth, async (req, res, next) => {
    try {
        const { image, title, description } = req.body;
        if (!image) {
            return res.status(422).json({ success: false, message: 'image URL is required' });
        }
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { $push: { projectSamples: { image, title: title || '', description: description || '' } } },
            { new: true, runValidators: true }
        );
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        res.json({ success: true, data: project });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Remove a single sample image by index
router.delete('/:id/samples/:sampleId', auth, async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        project.projectSamples = project.projectSamples.filter(
            (s) => s._id.toString() !== req.params.sampleId
        );
        await project.save();
        res.json({ success: true, data: project });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Delete project
router.delete('/:id', auth, async (req, res, next) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        res.json({ success: true, message: 'Project deleted' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
