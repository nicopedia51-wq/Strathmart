const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Ensure uploads directory exists when saving (created outside this route)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'public', 'uploads'));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, name);
  }
});

const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

// POST /api/uploads - single file upload (image or video)
router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: { message: 'No file uploaded' } });

    const host = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
    const fileUrl = `${host}/uploads/${req.file.filename}`;

    res.status(201).json({ status: 'success', data: { url: fileUrl, filename: req.file.filename } });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
});

module.exports = router;
