const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const User = require('../models/User');
const { authenticate, authorize } = require('../middlewares/auth');
const { sendWhatsapp } = require('../utils/whatsapp');

router.get('/pending-payments', authenticate, authorize(['keuangan']), async (req, res) => {
    try {
        const list = await Registration.findAll({
            where: {
                paymentProofUrl: { [require('sequelize').Op.not]: null }
            },
            include: [{ model: User }],
            order: [['updatedAt', 'DESC']]
        });
        res.json(list);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/verify-payment/:id', authenticate, authorize(['keuangan']), async (req, res) => {
    try {
        const { status, reason } = req.body; // 'verified' or 'rejected'
        const reg = await Registration.findOne({
            where: { id: req.params.id },
            include: [User]
        });
        if (!reg) return res.status(404).json({ message: 'Not found' });

        reg.paymentStatus = status;
        await reg.save();

        // Notify Student
        if (status === 'verified' && reg.User.wa) {
            await sendWhatsapp(reg.User.wa, `Halo ${reg.User.name}, pembayaran Anda telah DISETUJUI oleh bagian keuangan. Silakan login ke dashboard dan segera lengkapi formulir pendaftaran Anda.`);

            // Send internal message
            const Message = require('../models/Message');
            await Message.create({
                userId: reg.userId,
                title: 'Pembayaran Disetujui',
                content: 'Pembayaran Anda telah diverifikasi. Silakan lanjutkan ke tahap pengisian formulir.',
                type: 'info'
            });

        } else if (status === 'rejected' && reg.User.wa) {
            const rejectMsg = reason ? `Alasan: ${reason}` : 'Silakan upload kembali bukti transfer yang valid.';
            await sendWhatsapp(reg.User.wa, `Halo ${reg.User.name}, mohon maaf bukti pembayaran Anda DITOLAK. ${rejectMsg} Silakan login untuk detailnya.`);

            // Send internal message
            const Message = require('../models/Message');
            await Message.create({
                userId: reg.userId,
                title: 'Pembayaran Ditolak',
                content: `Bukti pembayaran Anda ditolak. ${rejectMsg}`,
                type: 'payment_reject'
            });
        }

        res.json(reg);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
