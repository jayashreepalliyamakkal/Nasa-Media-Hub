const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_KEY = process.env.NASA_API_KEY;

// Get APOD by date
router.get('/', async (req, res) => {
    const { date } = req.query;  // Fetch the date from the query string
    if (!date) {
        return res.status(400).json({ error: "Date query parameter is required." });
    }

    try {
        const response = await axios.get(`https://api.nasa.gov/planetary/apod?date=${date}&api_key=${API_KEY}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
