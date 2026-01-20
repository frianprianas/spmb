const bcrypt = require('bcryptjs');
const sequelize = require('./models/db');
const User = require('./models/User');

const seed = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true }); // Ensure Schema is updated (Enum 'panitia')
        console.log('Database connected and synced');

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
            console.log('Default panitia created: panitia@bn666.com / buhun666');
        } else {
            console.log('Panitia user already exists');
        }
    } catch (error) {
        console.error('Error seeding:', error);
    } finally {
        await sequelize.close();
    }
};

seed();
