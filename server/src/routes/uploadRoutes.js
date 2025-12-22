const express = require('express');
const router = express.Router();
const { uploadFile } = require('../controllers/uploadController');
const { protect } = require('../middlewares/authMiddleware');

const cloudinaryConfig = require('../config/cloudinary');

// Use Cloudinary if credentials are provided in .env (Preferred)
// Fallback to local storage only if Cloudinary is not configured
const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY;
const upload = useCloudinary ? cloudinaryConfig.upload : require('../utils/fileUpload');

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
