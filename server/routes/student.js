const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Registration = require('../models/Registration');
const User = require('../models/User');
const Department = require('../models/Department');
const { authenticate, authorize } = require('../middlewares/auth');
const { sendWhatsapp } = require('../utils/whatsapp');
const { sendAdminNotification } = require('../utils/notification');

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

router.get('/me', authenticate, authorize(['siswa']), async (req, res) => {
    try {
        const reg = await Registration.findOne({
            where: { userId: req.user.id },
            include: [Department, User]
        });
        res.json(reg);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/upload-docs', authenticate, authorize(['siswa']), upload.fields([{ name: 'kk' }, { name: 'akte' }]), async (req, res) => {
    try {
        const reg = await Registration.findOne({ where: { userId: req.user.id } });
        if (!reg) return res.status(404).json({ message: 'Registration not found' });

        if (req.files.kk) reg.kkUrl = req.files.kk[0].path;
        if (req.files.akte) reg.akteUrl = req.files.akte[0].path;

        if (reg.stage === 1) reg.stage = 2;
        await reg.save();
        res.json(reg);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/upload-payment', authenticate, authorize(['siswa']), upload.single('payment'), async (req, res) => {
    try {
        const { paymentAmount } = req.body;

        if (!paymentAmount || parseInt(paymentAmount) < 300000) {
            // Delete uploaded file if validation fails
            if (req.file) require('fs').unlinkSync(req.file.path);
            return res.status(400).json({ message: 'Jumlah transfer minimal Rp 300.000 untuk melanjutkan pendaftaran.' });
        }

        const reg = await Registration.findOne({
            where: { userId: req.user.id },
            include: [User]
        });
        if (!reg) return res.status(404).json({ message: 'Registration not found' });

        reg.paymentProofUrl = req.file.path;
        reg.paymentStatus = 'pending';
        reg.paymentAmount = parseInt(paymentAmount);

        if (reg.stage === 2) reg.stage = 3;
        await reg.save();

        // Notify Finance
        const financeUsers = await User.findAll({ where: { role: 'keuangan' } });
        for (const finance of financeUsers) {
            if (finance.wa) {
                await sendWhatsapp(finance.wa, `Notifikasi Pembayaran: Calon siswa ${reg.User.name} telah mentransfer Rp ${paymentAmount} dan mengunggah bukti. Silakan cek dashboard keuangan.`);
            }
        }

        res.json(reg);
    } catch (error) {
        if (req.file) require('fs').unlinkSync(req.file.path);
        res.status(500).json({ error: error.message });
    }
});

router.post('/complete-data', authenticate, authorize(['siswa']), async (req, res) => {
    try {
        const reg = await Registration.findOne({
            where: { userId: req.user.id },
            include: [User, Department]
        });
        if (!reg) return res.status(404).json({ message: 'Registration not found' });
        if (reg.paymentStatus !== 'verified') return res.status(400).json({ message: 'Payment not verified yet' });

        reg.fullData = req.body;
        reg.stage = 5;
        reg.isCompleted = true;
        await reg.save();

        // Notify Admin
        await sendAdminNotification(reg.User.name, reg.Department ? reg.Department.name : '-');

        res.json(reg);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/messages', authenticate, authorize(['siswa']), async (req, res) => {
    try {
        const Message = require('../models/Message');
        const messages = await Message.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/messages/:id/read', authenticate, authorize(['siswa']), async (req, res) => {
    try {
        const Message = require('../models/Message');
        const msg = await Message.findOne({ where: { id: req.params.id, userId: req.user.id } });
        if (msg) {
            msg.isRead = true;
            await msg.save();
        }
        res.json({ message: 'Read' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
