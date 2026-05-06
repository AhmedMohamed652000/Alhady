const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Client = require('../models/Client');

router.get('/', async (req, res, next) => {
    try {
        const clients = await Client.find({ active: true }).sort({ order: 1 });
        res.json({ success: true, data: clients });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Create client
router.post('/', auth, [
    body('title').notEmpty().withMessage('Title is required')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, message: errors.array()[0].msg });
    }

    try {
        const client = await Client.create(req.body);
        res.status(201).json({ success: true, data: client });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Update client
router.put('/:id', auth, [
    body('title').notEmpty().withMessage('Title is required')
], async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, message: errors.array()[0].msg });
    }

    try {
        const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!client) {
            return res.status(404).json({ success: false, message: 'Client not found' });
        }
        res.json({ success: true, data: client });
    } catch (error) {
        next(error);
    }
});

// ADMIN: Delete client
router.delete('/:id', auth, async (req, res, next) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        if (!client) {
            return res.status(404).json({ success: false, message: 'Client not found' });
        }
        res.json({ success: true, message: 'Client deleted' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
