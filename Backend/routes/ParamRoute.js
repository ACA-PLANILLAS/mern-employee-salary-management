import express from 'express';

import { getAllParameter, getParameterById, getParameterByType, updateParameter } from '../controllers/ParametersController.js';
const router = express.Router();


router.get('/', getAllParameter);
router.get('/:id', getParameterById);
router.get('/type/:type', getParameterByType);
router.put('/', updateParameter);

export default router;