const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nisn: {
        type: DataTypes.STRING(10),
        allowNull: true,
    },
    wa: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    otp: {
        type: DataTypes.STRING(6),
        allowNull: true,
    },
    otpExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    otpResendCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    lastOtpResend: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    lastPasswordReset: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'keuangan', 'panitia', 'siswa'),
        allowNull: false,
        defaultValue: 'siswa',
    },
});

module.exports = User;
