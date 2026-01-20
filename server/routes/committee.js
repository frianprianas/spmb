const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Registration = require('../models/Registration');
const Department = require('../models/Department');
const { authenticate, authorize } = require('../middlewares/auth');

// Get all offline registrations
router.get('/students', authenticate, authorize(['panitia']), async (req, res) => {
    try {
        const students = await Registration.findAll({
            where: { registrationType: 'offline' },
            include: [{ model: User }, { model: Department }],
            order: [['createdAt', 'DESC']]
        });
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Register new student offline
router.post('/register-offline', authenticate, authorize(['panitia']), async (req, res) => {
    try {
        const {
            name, email, wa, password, // User fields
            departmentId, paymentAmount, // Registration fields
            ...fullData // Rest goes to fullData
        } = req.body;

        // Check if user exists
        let user = await User.findOne({ where: { email } });
        if (user) return res.status(400).json({ message: 'Email sudah terdaftar' });

        const hashedPassword = await bcrypt.hash(password || '123456', 10); // Default password

        // Create User
        user = await User.create({
            name,
            email,
            password: hashedPassword,
            wa,
            role: 'siswa',
            isVerified: true // Auto verify account
        });

        // Create Registration
        const registration = await Registration.create({
            userId: user.id,
            departmentId,
            stage: 5, // Fully completed
            paymentStatus: 'verified',
            paymentAmount: paymentAmount ? parseInt(paymentAmount) : 0,
            registrationType: 'offline',
            isCompleted: true,
            fullData
        });

        res.json({ message: 'Siswa berhasil didaftarkan secara offline', registration });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
