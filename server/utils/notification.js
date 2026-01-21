const User = require('../models/User');
const Registration = require('../models/Registration');
const Department = require('../models/Department');
const { sendWhatsapp } = require('./whatsapp');
const sequelize = require('../models/db');

const sendAdminNotification = async (studentName, departmentName) => {
    try {
        // 1. Get Stats
        const totalStudents = await Registration.count();

        // Group by department
        const deptStats = await Registration.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('Registration.id')), 'count']
            ],
            include: [{
                model: Department,
                attributes: ['name']
            }],
            group: ['Department.id', 'Department.name']
        });

        let statsMsg = `TOTAL SELURUH SISWA : ${totalStudents}\nTOTAL PER JURUSAN :`;
        deptStats.forEach(stat => {
            if (stat.Department) {
                statsMsg += `\n- ${stat.Department.name} : ${stat.get('count')}`;
            }
        });

        // 2. Format Message
        const message = `*INFO PENDAFTAR BARU*\n\n` +
            `Nama : ${studentName}\n` +
            `Jurusan : ${departmentName}\n\n` +
            `${statsMsg}\n\n` +
            `Admin SPMB`;

        // 3. Get Admins
        const admins = await User.findAll({ where: { role: 'admin' } });

        // 4. Send Message to all admins
        for (const admin of admins) {
            if (admin.wa) {
                await sendWhatsapp(admin.wa, message);
            }
        }
        console.log('Admin notification sent for:', studentName);
    } catch (error) {
        console.error('Failed to send admin notification:', error);
    }
};

module.exports = { sendAdminNotification };
