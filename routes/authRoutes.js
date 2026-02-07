const express = require('express');
const router = express.Router();
const { login, verifyToken } = require('../controllers/authController');

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Admin username
 *           example: admin
 *         password:
 *           type: string
 *           format: password
 *           description: Admin password
 *           example: manigram#2025@ndhadmin
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         token:
 *           type: string
 *           description: JWT token
 *         user:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             role:
 *               type: string
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login as admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Missing credentials
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/verify:
 *   post:
 *     summary: Verify token (Mock)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: admin
 *                     role:
 *                       type: string
 *                       example: admin
 */
router.post('/verify', verifyToken);

module.exports = router;
