const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Registration = require('../models/Registration');
const { sendWhatsapp } = require('../utils/whatsapp');

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, nisn, wa, alamat, hp, sekolahAsal, departmentId } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'Email sudah terdaftar' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'siswa',
            nisn,
            wa,
            otp,
            otpExpiresAt,
            isVerified: false
        });

        // Create initial registration record with full data
        await Registration.create({
            userId: user.id,
            departmentId: departmentId,
            fullData: { alamat, hp, sekolahAsal }
        });

        // Send OTP via WhatsApp
        await sendWhatsapp(wa, `Selamat Datang ${name} silahkan Login di web dan masukan OTP ini yang berlaku 5 menit . ${otp} SPMB Online SMK Bakti Nusantara 666`);

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                wa: user.wa,
                isVerified: false
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ message: 'Email dan OTP harus diisi' });

        const user = await User.findOne({ where: { email, otp } });

        if (!user) return res.status(400).json({ message: 'Kode OTP salah atau email tidak ditemukan' });

        if (user.otpExpiresAt && new Date() > new Date(user.otpExpiresAt)) {
            return res.status(400).json({ message: 'Kode OTP sudah kadaluarsa. Silahkan minta kode baru.' });
        }

        user.isVerified = true;
        user.otp = null; // Clear OTP after verification
        await user.save();

        res.json({ message: 'Verifikasi berhasil' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                wa: user.wa,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/resend-otp', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
        if (user.isVerified) return res.status(400).json({ message: 'Akun sudah terverifikasi' });

        const now = new Date();
        const lastResend = user.lastOtpResend ? new Date(user.lastOtpResend) : null;

        // Reset count if last resend was on a different day
        if (lastResend && (lastResend.getDate() !== now.getDate() || lastResend.getMonth() !== now.getMonth() || lastResend.getFullYear() !== now.getFullYear())) {
            user.otpResendCount = 0;
        }

        if (user.otpResendCount >= 3) {
            return res.status(400).json({ message: 'Batas kirim ulang OTP harian (3x) tercapai. Silahkan coba besok.' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
        user.otpResendCount += 1;
        user.lastOtpResend = now;
        await user.save();

        await sendWhatsapp(user.wa, `Selamat Datang ${user.name} silahkan Login di web dan masukan OTP ini yang berlaku 5 menit . ${otp} SPMB Online SMK Bakti Nusantara 666`);

        res.json({ message: 'Kode OTP baru berhasil dikirim via WhatsApp' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
