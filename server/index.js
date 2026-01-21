const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const sequelize = require('./models/db');
const User = require('./models/User');
const Registration = require('./models/Registration');
const Department = require('./models/Department');
const Message = require('./models/Message');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const financeRoutes = require('./routes/finance');
const adminRoutes = require('./routes/admin');
const committeeRoutes = require('./routes/committee');
const wilayahRoutes = require('./routes/wilayah');

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/committee', committeeRoutes);
app.use('/api/wilayah', wilayahRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(async () => {
    console.log('Database connected and synced');

    // Seed admin if not exists
    const adminCount = await User.count({ where: { role: 'admin' } });
    if (adminCount === 0) {
        const hashedPassword = await bcrypt.hash('buhun666', 10);
        await User.create({
            name: 'Root Admin',
            email: 'admin@bn666.com',
            password: hashedPassword,
            wa: '082121635987',
            role: 'admin',
        });
        console.log('Default admin created');
    }

    // Seed finance if not exists
    const financeCount = await User.count({ where: { role: 'keuangan' } });
    if (financeCount === 0) {
        const hashedPassword = await bcrypt.hash('buhun666', 10);
        await User.create({
            name: 'Finance Officer',
            email: 'finance@bn666.com',
            password: hashedPassword,
            wa: '082121635987',
            role: 'keuangan',
        });
        console.log('Default finance created');
    }

    // Seed panitia if not exists
    const panitiaCount = await User.count({ where: { role: 'panitia' } });
    if (panitiaCount === 0) {
        const hashedPassword = await bcrypt.hash('buhun666', 10);
        await User.create({
            name: 'Panitia PPDB',
            email: 'panitia@bn666.com',
            password: hashedPassword,
            wa: '082121635987',
            role: 'panitia',
        });
        console.log('Default panitia created');
    }

    // Seed departments if not exists
    const deptCount = await Department.count();
    if (deptCount === 0) {
        await Department.bulkCreate([
            { name: 'RPL (Rekayasa Perangkat Lunak)', quota: 100 },
            { name: 'DKV (Desain Komunikasi Visual)', quota: 100 },
            { name: 'Animasi', quota: 100 },
            { name: 'AKL (Akuntansi dan Keuangan Lembaga)', quota: 100 },
            { name: 'Pemasaran', quota: 100 },
        ]);
        console.log('Initial departments created');
    }

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Unable to connect to database:', err);
});
