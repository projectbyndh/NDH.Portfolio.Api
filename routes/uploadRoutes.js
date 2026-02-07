const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     summary: Upload an image file
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload (jpeg, jpg, png, gif, webp)
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Image uploaded successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     imageUrl:
 *                       type: string
 *                       example: /uploads/1735862456789-987654321.jpg
 *                     filename:
 *                       type: string
 *                       example: 1735862456789-987654321.jpg
 *       400:
 *         description: Bad request - invalid file or no file uploaded
 *       413:
 *         description: File too large
 *       500:
 *         description: Server error
 */
router.post('/image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Return the Cloudinary URL
    const imageUrl = req.file.path; // Cloudinary URL

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        imageUrl: imageUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        cloudinaryId: req.file.filename // Cloudinary public ID
      }
    });

  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/upload/images:
 *   post:
 *     summary: Upload multiple image files
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - images
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Multiple image files to upload (jpeg, jpg, png, gif, webp)
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Images uploaded successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     images:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           imageUrl:
 *                             type: string
 *                             example: /uploads/1735862456789-987654321.jpg
 *                           filename:
 *                             type: string
 *                             example: 1735862456789-987654321.jpg
 *       400:
 *         description: Bad request - invalid files or no files uploaded
 *       413:
 *         description: Files too large
 *       500:
 *         description: Server error
 */
router.post('/images', upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided'
      });
    }

    // Return array of Cloudinary URLs
    const images = req.files.map(file => ({
      imageUrl: file.path, // Cloudinary URL
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      cloudinaryId: file.filename // Cloudinary public ID
    }));

    res.status(200).json({
      success: true,
      message: `${req.files.length} image(s) uploaded successfully`,
      data: {
        images: images,
        count: req.files.length
      }
    });

  } catch (error) {
    console.error('Multiple images upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message
    });
  }
});

module.exports = router;
