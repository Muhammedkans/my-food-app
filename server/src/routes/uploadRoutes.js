const express = require('express');
const router = express.Router();
const { uploadFile } = require('../controllers/uploadController');
const upload = require('../utils/fileUpload');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, upload.single('image'), uploadFile);

module.exports = router;
