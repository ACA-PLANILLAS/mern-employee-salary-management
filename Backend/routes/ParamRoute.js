import express from 'express';

import { getAllParameter, getParameterById, getParameterByType, updateParameter } from '../controllers/ParametersController.js';
const router = express.Router();

/**
 * @swagger
 * /api/parameters:
 *   get:
 *     summary: Obtener todos los parámetros del sistema
 *     description: Retorna una lista completa de todos los parámetros configurados en el sistema
 *     tags: [Parámetros]
 *     responses:
 *       200:
 *         description: Lista de parámetros obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID único del parámetro
 *                     example: 1
 *                   name:
 *                     type: string
 *                     description: Nombre del parámetro
 *                     example: "Tasa de cambio USD"
 *                   value:
 *                     type: string
 *                     description: Valor del parámetro
 *                     example: "1.25"
 *                   value_type:
 *                     type: string
 *                     enum: [INT, DOUBLE, STRING]
 *                     description: Tipo de dato del valor
 *                     example: "DOUBLE"
 *                   type:
 *                     type: string
 *                     description: Categoría del parámetro
 *                     example: "CURR"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "PARAM-003"
 */
router.get('/parameters/', getAllParameter);

/**
 * @swagger
 * /api/parameters/{id}:
 *   get:
 *     summary: Obtener un parámetro por su ID
 *     description: Busca y retorna un parámetro específico utilizando su ID único
 *     tags: [Parámetros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del parámetro
 *         example: 1
 *     responses:
 *       200:
 *         description: Parámetro encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID único del parámetro
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: Nombre del parámetro
 *                   example: "Tasa de cambio USD"
 *                 value:
 *                   type: string
 *                   description: Valor del parámetro
 *                   example: "1.25"
 *                 value_type:
 *                   type: string
 *                   enum: [INT, DOUBLE, STRING]
 *                   description: Tipo de dato del valor
 *                   example: "DOUBLE"
 *                 type:
 *                   type: string
 *                   description: Categoría del parámetro
 *                   example: "CURR"
 *       404:
 *         description: Parámetro no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "PARAM-003"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "PARAM-003"
 */
router.get('/parameters/:id', getParameterById);

/**
 * @swagger
 * /api/parameters/type/{type}:
 *   get:
 *     summary: Obtener parámetros por tipo
 *     description: Busca y retorna todos los parámetros que pertenecen a una categoría específica
 *     tags: [Parámetros]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           maxLength: 4
 *         description: Categoría del parámetro (máximo 4 caracteres)
 *         example: "CURR"
 *     responses:
 *       200:
 *         description: Lista de parámetros del tipo especificado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID único del parámetro
 *                     example: 1
 *                   name:
 *                     type: string
 *                     description: Nombre del parámetro
 *                     example: "Tasa de cambio USD"
 *                   value:
 *                     type: string
 *                     description: Valor del parámetro
 *                     example: "1.25"
 *                   value_type:
 *                     type: string
 *                     enum: [INT, DOUBLE, STRING]
 *                     description: Tipo de dato del valor
 *                     example: "DOUBLE"
 *                   type:
 *                     type: string
 *                     description: Categoría del parámetro
 *                     example: "CURR"
 *       404:
 *         description: No se encontraron parámetros del tipo especificado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "PARAM-003"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "PARAM-003"
 */
router.get('/parameters/type/:type', getParameterByType);

/**
 * @swagger
 * /api/parameters:
 *   put:
 *     summary: Actualizar un parámetro existente
 *     description: Modifica el nombre y valor de un parámetro específico utilizando su ID
 *     tags: [Parámetros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - value
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID único del parámetro a actualizar
 *                 example: 1
 *               name:
 *                 type: string
 *                 maxLength: 100
 *                 description: Nuevo nombre del parámetro
 *                 example: "Nueva tasa de cambio USD"
 *               value:
 *                 type: string
 *                 maxLength: 255
 *                 description: Nuevo valor del parámetro
 *                 example: "1.30"
 *           example:
 *             id: 1
 *             name: "Nueva tasa de cambio USD"
 *             value: "1.30"
 *     responses:
 *       200:
 *         description: Parámetro actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "PARAM-000"
 *       404:
 *         description: Parámetro no encontrado para actualizar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "PARAM-003"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "PARAM-003"
 */
router.put('/parameters/', updateParameter);

export default router;