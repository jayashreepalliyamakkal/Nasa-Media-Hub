// server/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Import routes
const apodRoutes = require('./routes/apod');
const mediaRoutes = require('./routes/media');

// Use routes
app.use('/api/apod', apodRoutes);
app.use('/api/media', mediaRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
