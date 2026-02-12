const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configure Cloudinary storage for CVs
const cvStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ndh-portfolio/cvs', // Separate folder for CVs
        allowed_formats: ['pdf', 'doc', 'docx'],
        resource_type: 'raw', // Important: 'raw' for non-image files
    },
});

// File filter - only allow PDF and DOC files
const cvFileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(file.originalname.toLowerCase());

    if (mimetype || extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only PDF, DOC, and DOCX files are allowed for CV uploads'));
    }
};

// Multer configuration for CV uploads
const cvUpload = multer({
    storage: cvStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size for CVs
    },
    fileFilter: cvFileFilter
});

module.exports = cvUpload;
