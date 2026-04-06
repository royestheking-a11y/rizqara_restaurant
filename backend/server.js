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
  
  // Internal Self-Ping to prevent sleep (if supported by environment)
  // Usually platforms like Render/Fly.io require external pings, but 
  // some environments stay awake if there's internal activity.
  const rootUrl = `http://localhost:${PORT}`;
  setInterval(() => {
    require('http').get(rootUrl, (res) => {
      // Silent success
    }).on('error', (err) => {
      // Silent error
    });
  }, 10 * 60 * 1000); // 10 minutes
});
