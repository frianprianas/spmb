const sequelize = require('./models/db');
const User = require('./models/User');

const check = async () => {
    try {
        await sequelize.authenticate();
        const user = await User.findOne({ where: { email: 'panitia@bn666.com' } });
        if (user) {
            console.log('FOUND: Panitia user exists with ID:', user.id);
        } else {
            console.log('NOT FOUND: Panitia user does not exist.');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

check();
