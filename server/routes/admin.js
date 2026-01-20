const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const User = require('../models/User');
const Registration = require('../models/Registration');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/departments', async (req, res) => {
    try {
        const list = await Department.findAll();
        res.json(list);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/departments', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const { name, quota } = req.body;
        const dept = await Department.create({ name, quota });
        res.json(dept);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/departments/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const { name, quota } = req.body;
        const dept = await Department.findByPk(req.params.id);
        if (!dept) return res.status(404).json({ message: 'Not found' });

        dept.name = name;
        dept.quota = quota;
        await dept.save();
        res.json(dept);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/departments/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const dept = await Department.findByPk(req.params.id);
        if (!dept) return res.status(404).json({ message: 'Not found' });
        await dept.destroy();
        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET all registered candidates (students)
router.get('/candidates', authenticate, authorize(['admin']), async (req, res) => {
    try {
        // Fetch all users with role 'siswa'
        const students = await User.findAll({
            where: { role: 'siswa' },
            attributes: ['id', 'name', 'email', 'wa', 'isVerified', 'createdAt', 'nisn'],
            include: [
                {
                    model: Registration,
                    include: [
                        { model: Department, attributes: ['name'] }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(students);
    } catch (error) {
        console.error("Error fetching candidates:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
