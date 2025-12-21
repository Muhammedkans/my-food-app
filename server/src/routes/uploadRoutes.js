const express = require('express');
const router = express.Router();
const { uploadFile } = require('../controllers/uploadController');
const { protect } = require('../middlewares/authMiddleware');

// Use Cloudinary for production/remote environments, local for development
const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER || process.env.VERCEL;
const upload = isProduction
  ? require('../config/cloudinary').upload
  : require('../utils/fileUpload');

router.post('/', protect, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('❌ Upload Error:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'Image upload failed',
        error: process.env.NODE_ENV === 'development' ? err : undefined
      });
    }
    next();
  });
}, uploadFile);

module.exports = router;
