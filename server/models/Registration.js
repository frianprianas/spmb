const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const User = require('./User');
const Department = require('./Department');

const Registration = sequelize.define('Registration', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    departmentId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: Department,
            key: 'id',
        },
    },
    stage: {
        type: DataTypes.INTEGER,
        defaultValue: 1, // 1: Register, 2: Upload Files, 3: Payment, 4: Full Data
    },
    kkUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    akteUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    paymentProofUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    paymentStatus: {
        type: DataTypes.ENUM('pending', 'verified', 'rejected'),
        defaultValue: 'pending',
    },
    paymentAmount: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    fullData: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
    isCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    registrationType: {
        type: DataTypes.ENUM('online', 'offline'),
        defaultValue: 'online',
    },
});

User.hasOne(Registration, { foreignKey: 'userId' });
Registration.belongsTo(User, { foreignKey: 'userId' });

Department.hasMany(Registration, { foreignKey: 'departmentId' });
Registration.belongsTo(Department, { foreignKey: 'departmentId' });

module.exports = Registration;
