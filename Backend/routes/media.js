// server/routes/media.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_KEY = process.env.NASA_API_KEY;

// Search media
router.get('/', async (req, res) => {
    const { query } = req;
    try {
        const response = await axios.get(`https://images-api.nasa.gov/search?q=${query.q}&api_key=${API_KEY}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
