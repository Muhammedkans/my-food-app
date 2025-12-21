const uploadFile = (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  // In production (Cloudinary), req.file.path is the full URL
  // In development (Local), req.file.path is the absolute system path, so we use /uploads/filename
  const filePath = process.env.NODE_ENV === 'production'
    ? req.file.path
    : `/uploads/${req.file.filename}`;

  res.status(201).json({
    success: true,
    data: filePath
  });
};

module.exports = {
  uploadFile
};
