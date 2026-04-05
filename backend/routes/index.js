const express = require('express');
const router = express.Router();
const models = require('../models');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
});

// Configure Multer with Memory Storage and 10MB limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

// Premium Image Upload Endpoint
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  // Upload memory buffer directly to Cloudinary via stream
  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: 'rizqara_restaurant' },
    (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ error: 'Failed to upload to Cloudinary' });
      }
      res.status(200).json({ url: result.secure_url });
    }
  );

  uploadStream.end(req.file.buffer);
});


// Helper to create basic CRUD routes for a model
const makeCrudRoutes = (modelName, path) => {
  const Model = models[modelName];
  
  router.get(`/${path}`, async (req, res) => {
    try {
      const data = await Model.find();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post(`/${path}`, async (req, res) => {
    try {
      const newItem = new Model(req.body);
      const saved = await newItem.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put(`/${path}/:id`, async (req, res) => {
    try {
      const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ error: 'Not found' });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete(`/${path}/:id`, async (req, res) => {
    try {
      const deleted = await Model.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Not found' });
      res.json({ message: 'Deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
};

// Create CRUD routes for all models
makeCrudRoutes('MenuItem', 'menu');
makeCrudRoutes('Chef', 'chefs');
makeCrudRoutes('Review', 'reviews');
makeCrudRoutes('GalleryImage', 'gallery');
makeCrudRoutes('CateringPackage', 'catering-packages');
makeCrudRoutes('CarouselSlide', 'carousel');
makeCrudRoutes('RestaurantTable', 'tables');
makeCrudRoutes('TableOrder', 'table-orders');
makeCrudRoutes('Order', 'orders');
makeCrudRoutes('Reservation', 'reservations');
makeCrudRoutes('Message', 'messages');
makeCrudRoutes('CateringRequest', 'catering-requests');

module.exports = router;
