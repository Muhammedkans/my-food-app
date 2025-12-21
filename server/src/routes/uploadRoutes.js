const express = require('express');
const router = express.Router();
const { uploadFile } = require('../controllers/uploadController');
const { protect } = require('../middlewares/authMiddleware');

// Use Cloudinary for production, local for development
const upload = process.env.NODE_ENV === 'production'
  ? require('../config/cloudinary').upload
  : require('../utils/fileUpload');

router.post('/', protect, upload.single('image'), uploadFile);

module.exports = router;
