const express = require('express');
const projectDb = require('../data/helpers/projectModel');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        res.json(await projectDb.get());
    } catch {
        res.status(500).json({ message: 'Server error retrieving projects.' });
    }
});

router.get('/:id', validateProjectId(), (req, res) => {
    try {
        res.status(200).json(req.project);
    } catch {
        res.status(500).json({ message: 'Server error retrieving project.' });
    }
});

router.get('/:id/actions', validateProjectId(), async (req, res) => {
    try {
        res.status(200).json(await projectDb.getProjectActions(req.params.id));
    } catch {
        res.status(500).json({ message: 'Server error retrieving actions.' });
    }
});

router.post('/', async (req, res) => {
    try {
        if (req.body.name && req.body.description) {
            return res.status(201).json(await projectDb.insert({
                name: req.body.name,
                description: req.body.description,
                completed: req.body.completed
            }));
        } else {
            res.status(400).json({ message: 'Missing required name and description fields.' });
        }
    } catch {
        res.status(500).json({ message: 'Server error adding project.' });
    }
});

router.delete('/:id', validateProjectId(), async (req, res) => {
    try {
        res.status(200).json(await projectDb.remove(req.params.id));
    } catch {
        res.status(500).json({ message: 'Server error removing project.' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        res.status(200).json(await projectDb.update(req.params.id, {
            name: req.body.name,
            description: req.body.description,
            completed: req.body.completed
        }));
    } catch {
        res.status(500).json({ message: 'Server error updating project.' });
    }
});

// middleware
function validateProjectId(req, res, next) {
    return async (req, res, next) => {
        try {
            const project = await projectDb.get(req.params.id);
            if (project) {
                req.project = project;
                next();
            } else {
                res.status(400).json({ message: 'invalid project id' });
            }
        } catch (err) {
            next(err);
        }
    }
}

module.exports = router;