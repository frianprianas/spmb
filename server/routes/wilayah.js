const express = require('express');
const router = express.Router();
const axios = require('axios');

// Proxy route for provinces
router.get('/provinces', async (req, res) => {
    try {
        const response = await axios.get('https://wilayah.id/api/provinces.json');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Proxy route for regencies
router.get('/regencies/:code', async (req, res) => {
    try {
        const response = await axios.get(`https://wilayah.id/api/regencies/${req.params.code}.json`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Proxy route for districts
router.get('/districts/:code', async (req, res) => {
    try {
        const response = await axios.get(`https://wilayah.id/api/districts/${req.params.code}.json`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Proxy route for villages
router.get('/villages/:code', async (req, res) => {
    try {
        const response = await axios.get(`https://wilayah.id/api/villages/${req.params.code}.json`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
