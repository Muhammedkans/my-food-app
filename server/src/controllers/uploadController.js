const uploadFile = (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  // Since we are forcing Cloudinary in all environments (including development), 
  // req.file.path will always be the Cloudinary URL.
  // We no longer need to check for production or fallback to local paths.
  const filePath = req.file.path || req.file.secure_url;

  res.status(201).json({
    success: true,
    data: filePath
  });
};

module.exports = {
  uploadFile
};
