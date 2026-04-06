const path = require('path');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: '*', // Allow all for simplicity during initial deployment
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api', apiRoutes);

// General route
app.get('/', (req, res) => {
  res.send('Rizqara API Server is running');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  
  // Improved Self-Ping to prevent sleep on platforms like Render
  // Render's free tier sleeps after 15 minutes of inactivity. 
  // Pinging the external URL every 14 minutes keeps it awake.
  const rootUrl = process.env.RENDER_EXTERNAL_URL || process.env.APP_URL || `http://localhost:${PORT}`;
  const httpModule = rootUrl.startsWith('https') ? require('https') : require('http');
  
  setInterval(() => {
    httpModule.get(rootUrl, (res) => {
      if (res.statusCode === 200) {
        console.log(`Self-ping successful: ${rootUrl}`);
      } else {
        console.log(`Self-ping returned status: ${res.statusCode}`);
      }
    }).on('error', (err) => {
      console.error(`Self-ping failed: ${err.message}`);
    });
  }, 14 * 60 * 1000); // 14 minutes
});
