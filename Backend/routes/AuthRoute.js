import express from 'express';
import { Login, LogOut, Me} from "../controllers/Auth.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *     LoginRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 */

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Obtener información del usuario actual
 *     tags: [Autenticación]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
 */
router.get('/me', Me);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Sesión iniciada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/login', Login);

/**
 * @swagger
 * /logout:
 *   delete:
 *     summary: Cerrar sesión
 *     tags: [Autenticación]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 *       401:
 *         description: No autorizado
 */
router.delete('/logout', LogOut);

export default router;