const express = require('express');
const router = express.Router();
const { uploadFile } = require('../controllers/uploadController');
const { protect } = require('../middlewares/authMiddleware');

// Use Cloudinary for production/remote environments, local for development
const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER || process.env.VERCEL;
const upload = isProduction
  ? require('../config/cloudinary').upload
  : require('../utils/fileUpload');

router.post('/', protect, upload.single('image'), uploadFile);

module.exports = router;
