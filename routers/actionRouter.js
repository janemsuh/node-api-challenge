const express = require('express');
const actionDb = require('../data/helpers/actionModel');
const projectDb = require('../data/helpers/projectModel');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        res.json(await actionDb.get());
    } catch {
        res.status(500).json({ message: 'Server error retrieving actions.' });
    }
});

router.get('/:id', validateActionId(), (req, res) => {
    try {
        res.status(200).json(req.action);
    } catch {
        res.status(500).json({ message: 'Server error retrieving action.' });
    }
});

router.post('/', validateProjectId(), async (req, res) => {
    try {
        if (req.body.project_id && req.body.description && req.body.notes) {
            return res.status(201).json(await actionDb.insert({
                project_id: req.body.project_id,
                description: req.body.description,
                notes: req.body.notes,
                completed: req.body.completed
            }));
        } else {
            res.status(400).json({ message: 'Missing required fields. Please enter valid project_id, description, and notes.' });
        }
    } catch {
        res.status(500).json({ message: 'Server error adding action.' });
    }
});

router.delete('/:id', validateActionId(), async (req, res) => {
    try {
        res.status(200).json(await actionDb.remove(req.params.id));
    } catch {
        res.status(500).json({ message: 'Server error removing action.' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        res.status(200).json(await actionDb.update(req.params.id, {
            project_id: req.params.projectId,
            description: req.body.description,
            notes: req.body.notes,
            completed: req.body.completed
        }));
    } catch {
        res.status(500).json({ message: 'Server error updating action.' });
    }
});

// middleware
function validateProjectId(req, res, next) {
    return async (req, res, next) => {
        try {
            const project = await projectDb.get(req.body.project_id);
            if (project) {
                next();
            } else {
                res.status(400).json({ message: 'invalid project id' });
            }
        } catch (err) {
            next(err);
        }
    }
}

function validateActionId(req, res, next) {
    return async (req, res, next) => {
        try {
            const action = await actionDb.get(req.params.id);
            if (action) {
                req.action = action;
                next();
            } else {
                res.status(400).json({ message: 'invalid action id' });
            }
        } catch (err) {
            next(err);
        }
    }
}

module.exports = router;