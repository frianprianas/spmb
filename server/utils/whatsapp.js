const axios = require('axios');
require('dotenv').config();

const sendWhatsapp = async (target, message) => {
    try {
        // Ensure number starts with 62
        let formattedTarget = target;
        if (formattedTarget.startsWith('0')) {
            formattedTarget = '62' + formattedTarget.slice(1);
        } else if (!formattedTarget.startsWith('62')) {
            formattedTarget = '62' + formattedTarget;
        }

        const response = await axios.post('https://api.fonnte.com/send', {
            target: formattedTarget,
            message: message,
            countryCode: '62',
        }, {
            headers: {
                'Authorization': process.env.FONNTE_TOKEN
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error sending WhatsApp:', error.response?.data || error.message);
        throw error;
    }
};

module.exports = { sendWhatsapp };
