const express = require('express');
const router = express.Router();
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');
const upload = require('../middleware/upload');

/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - image
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the blog
 *         title:
 *           type: string
 *           description: The title of the blog
 *         author:
 *           type: string
 *           description: The author of the blog
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the blog
 *         image:
 *           type: string
 *           description: The image URL of the blog
 *         description:
 *           type: string
 *           description: The description of the blog
 *       example:
 *         id: 60d5ecb74b24c72b8c8b4567
 *         title: My Blog Post
 *         author: John Doe
 *         date: 2023-06-25T00:00:00.000Z
 *         image: https://example.com/image.jpg
 *         description: This is a blog post description
 */

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Get all blogs
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: List of all blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 *       500:
 *         description: Server error
 */
router.route('/')
  .get(getAllBlogs)

/**
 * @swagger
 * /api/blogs:
 *   post:
 *     summary: Create a new blog
 *     tags: [Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - image
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the blog post
 *               author:
 *                 type: string
 *                 description: The author of the blog post
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file for the blog post (jpeg, jpg, png, gif, webp)
 *               description:
 *                 type: string
 *                 description: The description of the blog post
 *           example:
 *             title: New Blog Post
 *             author: Jane Doe
 *             image: (binary file)
 *             description: This is a new blog post
 *     responses:
 *       201:
 *         description: Blog created successfully
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
 *                   example: Blog created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Bad request
 */
  .post(upload.single('image'), createBlog);

/**
 * @swagger
 * /api/blogs/{id}:
 *   get:
 *     summary: Get a blog by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The blog ID
 *     responses:
 *       200:
 *         description: Blog retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
router.route('/:id')
  .get(getBlogById)

/**
 * @swagger
 * /api/blogs/{id}:
 *   put:
 *     summary: Update a blog by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The blog ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the blog post
 *               author:
 *                 type: string
 *                 description: The author of the blog post
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file for the blog post (jpeg, jpg, png, gif, webp)
 *               description:
 *                 type: string
 *                 description: The description of the blog post
 *     responses:
 *       200:
 *         description: Blog updated successfully
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
 *                   example: Blog updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Blog not found
 *       400:
 *         description: Bad request
 */
  .put(upload.single('image'), updateBlog)

/**
 * @swagger
 * /api/blogs/{id}:
 *   delete:
 *     summary: Delete a blog by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The blog ID
 *     responses:
 *       200:
 *         description: Blog deleted successfully
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
 *                   example: Blog deleted successfully
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
  .delete(deleteBlog);

module.exports = router;
