const uploadFile = (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  // Return the path relative to the server (client will need to prepend server URL)
  // Or return a full URL if we knew the host. 
  // For now, we return the relative path.
  const filePath = `/uploads/${req.file.filename}`;

  res.status(201).json({
    success: true,
    data: filePath
  });
};

module.exports = {
  uploadFile
};
