const express = require('express');
const router = express.Router();
const { uploadFile } = require('../controllers/uploadController');
const { protect } = require('../middlewares/authMiddleware');

const cloudinaryConfig = require('../config/cloudinary');

// FORCE Cloudinary usage in ALL environments (Development & Production)
const upload = cloudinaryConfig.upload;

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
