import express from 'express';

import { getAllParameter, getParameterById, getParameterByType, updateParameter } from '../controllers/ParametersController.js';
const router = express.Router();


router.get('/parameters/', getAllParameter);
router.get('/parameters/:id', getParameterById);
router.get('/parameters/type/:type', getParameterByType);
router.put('/parameters/', updateParameter);

export default router;