const { Sequelize } = require('sequelize');
const User = require('./models/User');
const Registration = require('./models/Registration');
const Department = require('./models/Department');
require('dotenv').config();

const sequelize = require('./models/db');

async function checkData() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const students = await User.findAll({
            where: { role: 'siswa' },
            include: [{ model: Registration, include: [Department] }]
        });

        console.log('Found students:', JSON.stringify(students, null, 2));

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

checkData();
